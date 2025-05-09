import { UIAuthorToDBAuthor, UIBookToDBBook } from '@book-play/models';
import { searchAuthor } from '@book-play/scraper';
import { containsLetters, Fb2Parser } from '@book-play/utils-common';
import {
  getJsonGzFileName,
  readFile,
  saveContentsToZipFile,
} from '@book-play/utils-node';
import { environment } from 'environments/environment.ts';
import mysql, { PoolOptions } from 'mysql2';
import { saveToDataBase } from './db';
import { deleteFiles, getFilesNames } from './files.ts';
import { unzipFile } from './zip.ts';

const workingDirectory = __dirname + '/' + process.argv[2];
const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);
const parser = new Fb2Parser();

export async function run(): Promise<void> {
  const zipFiles = await findZipFiles();
  for (const zipFile of zipFiles) {
    if (await unzipFile(zipFile, workingDirectory)) {
      const fb2Files = await findFb2Files();
      await parseFb2Files(fb2Files);
      deleteFiles(fb2Files);
      deleteFiles([zipFile]);
    }
  }

  pool.end();
  console.log('All done!');
}

export function findFb2Files(): Promise<string[]> {
  console.log('Start parsing fb2 books....');
  return new Promise((resolve, reject) => {
    getFilesNames(workingDirectory, '.fb2', (err: Error, results: string[]) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      console.log(`Found ${results.length} .fb2 files.`);
      resolve(results);
    });
  });
}

export function findZipFiles(): Promise<string[]> {
  console.log('Start looking for zips....');
  return new Promise((resolve, reject) => {
    getFilesNames(workingDirectory, '.zip', (err: Error, results: string[]) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      console.log(`Found ${results.length} zip archives.`);
      resolve(results);
    });
  });
}

async function parseFb2Files(results: string[]) {
  for (const file of results) {
    try {
      console.log('Working on ' + file + '...');
      const text = await readFile(file);
      const cheeroApi = parser.loadCheeroApi(text);
      const lang = parser.parseLanguage(cheeroApi);
      const book = parser.parseBookFromLoaded(cheeroApi);
      if (lang.toLowerCase() === 'ru') {
        if (
          [book.name, book.author.first, book.author.last].every((item) =>
            containsLetters(item)
          ) &&
          book.paragraphs.length > 0
        ) {
          const dbBook = UIBookToDBBook(book);
          const dbAuthor = UIAuthorToDBAuthor(book.author);

          const authorInfo = await searchAuthor(dbAuthor.first, dbAuthor.last);

          if (authorInfo) {
            dbAuthor.image = authorInfo.imageUrl || '';
            dbAuthor.about = authorInfo.about || '';
          }

          const insertedId = await saveToDataBase(pool, dbBook, dbAuthor).catch(
            (err) => {
              console.error(err.message);
            }
          );

          if (insertedId) {
            console.log('Added to database: ' + book.name);

            dbBook.id = insertedId;
            const fileName = getJsonGzFileName(
              environment.BOOKS_JSON_PATH + insertedId
            );

            const paragraphs = JSON.stringify(dbBook.paragraphs);
            saveContentsToZipFile(paragraphs, fileName);

            console.log(
              'Compressed json to gzip file: ' +
                getJsonGzFileName(insertedId) +
                '\n'
            );
          }
        }
      } else {
        console.log(
          `Skipping "${
            book.name
          }" because in [ ${lang.toUpperCase()} ] language`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}
