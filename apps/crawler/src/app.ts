import { DB_CONFIG } from '@book-play/constants';
import {
  containsLetters,
  Fb2Parser,
  UIBookToDBBook,
} from '@book-play/utils-common';
import { readFile, writeToFile } from '@book-play/utils-node';

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
  const pool = mysql.createPool(DB_CONFIG as unknown as PoolOptions);
  const parser = new Fb2Parser();

  for (const file of results) {
    try {
      const text = await readFile(file);
      const loaded = parser.load(text);
      const lang = parser.parseLanguage(loaded);
      const book = parser.parseBookFromLoaded(loaded);
      if (lang.toLowerCase() === 'ru') {
        if (
          [book.name, book.author.first, book.author.last].every((item) =>
            containsLetters(item)
          ) &&
          book.paragraphs.length > 0
        ) {
          const dbBook = UIBookToDBBook(book);
          const insertedId = await saveToDataBase(pool, dbBook).catch((err) => {
            console.error(err.message);
          });

          if (insertedId) {
            console.log('Added to database: ' + book.name);

            dbBook.id = insertedId;
            const fileName = await writeToFile(
              JSON.stringify(dbBook),
              __dirname + '/books-json/' + insertedId + '.json'
            ).catch((err) => console.error(err.message));

            if (fileName) {
              console.log('Saved json file: ' + insertedId + '.json\n');
            }
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
