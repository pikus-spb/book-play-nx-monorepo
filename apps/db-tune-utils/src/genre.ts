import { environment } from '@book-play/constants';
import { DBBook } from '@book-play/models';
import { log } from '@book-play/utils-common';
import { addGenres } from '@book-play/utils-node';
import mysql, { PoolOptions } from 'mysql2';
import { Pool as BasePool } from 'mysql2/typings/mysql/lib/Pool';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export async function runGenres() {
  log('Starting...');
  while (true) {
    log('====================================================================');
    log('Counting books...');
    const books = await getBooks(pool);

    log(`Found ${books.length} books.`);

    if (books.length === 0) {
      log('No more books to process.');
      break;
    }

    for (let i = 0; i < books.length; i++) {
      const book: Partial<DBBook> = books[i];

      log(`Updating ${book.id} - ${book.genres}`);

      const genres: string[] = JSON.parse(book.genres);
      if (genres && genres.length > 0) {
        await addGenres(pool, book.id, genres).catch((e) => {
          console.error(e);
        });
      }

      log(`Done ${i + 1} of ${books.length}`);
    }
  }

  pool.end();
  log('All done!');
}

async function getBooks(pool: BasePool): Promise<Partial<DBBook>[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT T1.id, T1.genres
       FROM books AS T1
              LEFT JOIN genres AS T2
                        ON T1.id = T2.bookId
       WHERE T2.id IS NULL AND T1.genres != '[]'`,
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
