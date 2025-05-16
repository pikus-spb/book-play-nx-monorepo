import { UIAuthorToDBAuthor, UIBookToDBBook } from '@book-play/models';
import { Fb2Parser } from '@book-play/utils-common';
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
export const parser = new Fb2Parser();
export const pool = mysql.createPool(
  environment.DB_CONFIG as unknown as PoolOptions
);

export async function run(): Promise<void> {
  const zipFiles = await findFiles('.zip');
  for (const zipFile of zipFiles) {
    if (await unzipFile(zipFile, workingDirectory)) {
      const fb2Files = await findFiles('.fb2');
      await parseFb2Files(fb2Files);
      deleteFiles(fb2Files);
      deleteFiles([zipFile]);
    }
  }

  pool.end();
  console.log('All done!');
}

async function parseFb2Files(results: string[]) {
  for (const file of results) {
    try {
      const { lang, book } = await getBookData(file);
      if (lang.toLowerCase() === 'ru') {
        if (checkBookDataIsValid(book)) {
          const dbBook = UIBookToDBBook(book);
          const dbAuthor = UIAuthorToDBAuthor(book.author);
          const authorId = await queryAuthorId(dbAuthor.full);

          if (authorId !== -1) {
            dbBook.authorId = String(authorId);
          } else {
            await addAdditionalDataToAuthor(dbAuthor);
          }

          saveToDataBase(dbBook, dbAuthor)
            .then((insertedId) => {
              if (insertedId) {
                console.log('Added to database: ' + book.name);

                dbBook.id = insertedId;
                const fileName = getJsonGzFileName(
                  environment.BOOKS_JSON_PATH + insertedId
                );
                saveContentsToZipFile(
                  JSON.stringify(dbBook.paragraphs),
                  fileName
                );
                console.log('Compressed json to gzip file: ' + fileName + '\n');
              }
            })
            .catch((err) =>
              console.error((err.sqlMessage || err.message || err) + '\n')
            );
        } else {
          console.log(
            `Skipping "${book.name}" because book data is not valid "${book.full}". \n`
          );
        }
      } else {
        console.log(
          `Skipping "${
            book.name
          }" because in [ ${lang.toUpperCase()} ] language \n`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}
