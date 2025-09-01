import { NOT_AVAILABLE } from '@book-play/constants';
import { DBBook } from '@book-play/models';
import { BookInfo, SearchBook } from '@book-play/scraper';
import { error, log } from '@book-play/utils-common';
import { environment } from 'environments/environment';
import mysql, { escape, PoolOptions } from 'mysql2';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export async function run() {
  const scrapper = new SearchBook();

  let books: Partial<DBBook>[];
  let count = 0;

  do {
    books = await selectBooks();
    count += books.length;
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      log('Searching book: ' + book.full + ' ...');

      const bookInfo: BookInfo = {
        rating: book.rating || 0,
        annotation: book.annotation || NOT_AVAILABLE,
      };

      await scrapper.init();

      let searchResult = null;
      try {
        searchResult = await scrapper.searchBook(book.full);
      } catch (e) {
        error(e);
        log('Reinit browser and retry...');
        i--;
        continue;
      }

      if (searchResult?.rating) {
        bookInfo.rating = searchResult.rating;
      }
      if (searchResult?.annotation) {
        bookInfo.annotation = searchResult.annotation;
      }

      const sqlQuery = `UPDATE books SET rating=${
        bookInfo.rating
      }, annotation=${escape(bookInfo.annotation)} WHERE id=${book.id}`;

      log(sqlQuery);

      try {
        await new Promise((resolve, reject) => {
          pool.query(sqlQuery, (err: Error) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        });
      } catch (e) {
        error(e);
      }

      log('Added successfully: ' + JSON.stringify(bookInfo) + '\n\n');
      await scrapper.finalize();
    }
  } while (books.length > 0);

  console.log('Done. Added info about ' + count + ' books.');
}

async function selectBooks(): Promise<Partial<DBBook>[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id, full, rating, annotation FROM books WHERE rating IS NULL OR annotation = '' LIMIT 100`,
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
