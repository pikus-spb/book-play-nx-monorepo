import { UIAuthorToDBAuthor, UIBookToDBBook } from '@book-play/models';
import { Fb2Parser } from '@book-play/utils-common';
import {
  getJsonGzFileName,
  saveContentsToZipFile,
} from '@book-play/utils-node';
import { environment } from 'environments/environment.ts';
import mysql, { PoolOptions } from 'mysql2';
import { addAdditionalDataToAuthor } from './author.ts';
import { saveToDataBase } from './db';
import { deleteFiles } from './files.ts';
import { findFiles } from './find.ts';
import { jquery } from './parse.ts';
import { checkBookDataIsValid } from './validation.ts';
import { unzipFile } from './zip.ts';

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
      const $ = await jquery(file);
      const lang = parser.getLanguage($);
      const book = parser.getBook($);

      if (lang.toLowerCase() === 'ru') {
        if (checkBookDataIsValid(book)) {
          const dbBook = UIBookToDBBook(book);
          const dbAuthor = UIAuthorToDBAuthor(book.author);

          await addAdditionalDataToAuthor(dbAuthor);

          const insertedId = await saveToDataBase(dbBook, dbAuthor).catch(
            (err) => console.error((err.sqlMessage || err.message) + '\n')
          );
          if (insertedId) {
            console.log('Added to database: ' + book.name);

            dbBook.id = insertedId;
            const fileName = getJsonGzFileName(
              environment.BOOKS_JSON_PATH + insertedId
            );

            saveContentsToZipFile(JSON.stringify(dbBook.paragraphs), fileName);
            console.log('Compressed json to gzip file: ' + fileName + '\n');
          }
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
