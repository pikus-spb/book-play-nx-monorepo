import { UIAuthorToDBAuthor, UIBookToDBBook } from '@book-play/models';
import { searchAuthor } from '@book-play/scraper';
import { containsLetters, Fb2Parser } from '@book-play/utils-common';
import {
  getJsonGzFileName,
  readFile,
  saveContentsToZipFile,
} from '@book-play/utils-node';
import { environment } from 'environments/environment.ts';

import fs from 'fs';
import mysql, { PoolOptions } from 'mysql2';
import path from 'path';
import { saveToDataBase } from './db';

export function run() {
  console.log('Start looking for books....');
  getFilesNames(
    __dirname + '/' + process.argv[2],
    (err: Error, results: string[]) => {
      if (err) {
        throw err;
      }
      console.log(`Found ${results.length} files.`);
      parseFiles(results).then(() => {
        console.log('All done!');
      });
    }
  );
}

function getFilesNames(
  dir: string,
  done: (err: Error, results: string[]) => void
) {
  let results = [];
  fs.readdir(dir, (err, list) => {
    const next = () => {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          getFilesNames(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.fb2')) {
            console.log('Found: ' + file + '...');
            results.push(file);
          }
          next();
        }
      });
    };

    if (err) {
      return done(err, []);
    }
    let i = 0;
    next();
  });
}

async function parseFiles(results: string[]) {
  const pool = mysql.createPool(
    environment.DB_CONFIG as unknown as PoolOptions
  );
  const parser = new Fb2Parser();

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

  pool.end();
}
