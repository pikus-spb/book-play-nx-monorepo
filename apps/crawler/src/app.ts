import { DB_CONFIG } from '@book-play/constants';
import {
  containsLetters,
  Fb2Parser,
  isBookInRussian,
  UIBookToDBBook,
} from '@book-play/utils';
import fs from 'fs';
import mysql, { PoolOptions } from 'mysql2';
import path from 'path';
import { addToDataBase } from './db';
import { readFile } from './fs';

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
      const book = parser.parseBookFromString(text);
      if (isBookInRussian(book) && containsLetters(book.author.fullName)) {
        await addToDataBase(pool, UIBookToDBBook(book))
          .then((name) => console.log('Added to database: ' + name))
          .catch((err) => console.error(err.message));
      }
    } catch (e) {
      console.error(e);
    }
  }

  pool.end();
}
