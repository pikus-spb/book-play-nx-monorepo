import { UIAuthorToDBAuthor, UIBookToDBBook } from '@book-play/models';
import { SearchBook } from '@book-play/scraper';
import { error, Fb2Parser, log } from '@book-play/utils-common';
import {
  getJsonGzFileName,
  saveContentsToZipFile,
  unzipFile,
} from '@book-play/utils-node';
import { environment } from 'environments/environment.ts';
import mysql, { PoolOptions } from 'mysql2';
import { addAdditionalDataToAuthor } from './author-info.ts';
import { saveToDataBase } from './db';
import { queryAuthorId } from './db.ts';
import { deleteFiles, findFiles } from './files.ts';
import { getBookData } from './parse.ts';
import { checkBookDataIsValid } from './validation.ts';

export const workingDirectory = __dirname + '/' + process.argv[2];
const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);
export const parser = new Fb2Parser();
const scrapper = new SearchBook();
scrapper.init().then(() => run());

export async function run(): Promise<void> {
  log('\n\n\n');
  log('Starting...');

  const zipFiles = await findFiles('.zip');
  for (const zipFile of zipFiles) {
    try {
      if (await unzipFile(zipFile, workingDirectory)) {
        const fb2Files = await findFiles('.fb2');
        await parseFb2Files(fb2Files);
        deleteFiles(fb2Files);
        deleteFiles([zipFile]);
      }
    } catch (err) {
      error(err);
    }
  }

  pool.end();
  await scrapper.finalize();

  log('All done!');
}

async function parseFb2Files(results: string[]) {
  for (const file of results) {
    try {
      const { lang, book } = await getBookData(file);
      if (lang.toLowerCase().match('ru')) {
        if (checkBookDataIsValid(book)) {
          log('\n');
          log(JSON.stringify(book.full));
          const dbBook = UIBookToDBBook(book);
          const dbAuthor = UIAuthorToDBAuthor(book.author);
          const authorId = await queryAuthorId(pool, dbAuthor.full);

          if (authorId !== -1) {
            dbBook.authorId = String(authorId);
            log('Author already known: [' + authorId + ']');
          } else {
            log('Adding info about author "' + dbAuthor.full + '"...');
            await addAdditionalDataToAuthor(dbAuthor);
          }

          try {
            const insertedId = await saveToDataBase(pool, dbBook, dbAuthor);
            if (insertedId) {
              log('Added to database: ' + book.name);

              dbBook.id = insertedId;
              const fileName = getJsonGzFileName(
                environment.BOOKS_JSON_PATH + insertedId
              );
              saveContentsToZipFile(
                JSON.stringify(dbBook.paragraphs),
                fileName
              );
              log('Compressed json to gzip file: ' + fileName + '\n');
            }
          } catch (err) {
            error(err);
          }
        } else {
          log(
            `Skipping "${book.name}" because book data is not valid "${book.full}". \n`
          );
        }
      } else {
        log(
          `Skipping "${
            book.name
          }" because in [ ${lang.toUpperCase()} ] language \n`
        );
      }
    } catch (err) {
      error(err);
    }
  }
}
