import { environment } from '@book-play/constants';
import { DBBook } from '@book-play/models';
import { log } from '@book-play/utils-common';
import mysql, { escape, PoolOptions } from 'mysql2';
import { Pool as BasePool } from 'mysql2/typings/mysql/lib/Pool';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export async function runFix() {
  log('Starting...');
  log('================================================');
  log('Counting books...');
  const books = await getBooks(pool);

  log(`Found ${books.length} books.`);

  for (let i = 0; i < books.length; i++) {
    const book: Partial<DBBook> = books[i];

    log(`Updating ${book.id} - ${book.genres}`);

    const genres: string[] = JSON.parse(book.genres).filter(
      (genre: string) => genre.length < 50
    );
    await updateGenres(book.id, genres).catch((e) => {
      console.error(e);
    });

    log(`Done ${i} of ${books.length}`);
  }

  pool.end();
  log('All done!');
}

function updateGenres(bookId: string, genres: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE books SET genres = ${escape(
        JSON.stringify(genres)
      )} WHERE id=${bookId}`,
      (err: Error, result: ResultSetHeader) => {
        if (err) {
          reject(err);
        } else {
          resolve(bookId);
        }
      }
    );
  });
}

async function getBooks(pool: BasePool): Promise<Partial<DBBook>[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id, genres
       FROM books WHERE CHAR_LENGTH(genres) > 50`,
      (err: Error, result: Partial<DBBook>[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}
