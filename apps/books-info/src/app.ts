import { environment, NOT_AVAILABLE } from '@book-play/constants';
import { DBBook } from '@book-play/models';
import { BookInfo, SearchBook } from '@book-play/scraper';
import { error, log } from '@book-play/utils-common';
import mysql, { escape, PoolOptions } from 'mysql2';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

log('Starting books info scrapper...');

export async function run() {
  const scrapper = new SearchBook();

  log('\n\n\n');
  log('Scapper initialized...');

  const books: Partial<DBBook>[] = await selectBooks();

  log('Selected ' + books.length + ' books from DB');

  let retryNum = 0;
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    log('\n\n\n');
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
      log('Reinit Pupeeter and retry...');

      retryNum++;

      if (retryNum >= 3) {
        log('Too many retries, skip this book');
        retryNum = 0;
      } else {
        i--;
      }

      continue;
    } finally {
      await scrapper.finalize();
    }

    log('Search result: ' + JSON.stringify(searchResult));

    if (searchResult?.rating) {
      bookInfo.rating = searchResult.rating;
    }
    if (searchResult?.annotation) {
      bookInfo.annotation = searchResult.annotation;
    }

    const sqlQuery = `UPDATE books SET rating=${
      bookInfo.rating
    }, annotation=${escape(bookInfo.annotation)} WHERE id=${book.id}`;

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
  }

  console.log('Done. Added info about ' + books.length + ' books.');
}

async function selectBooks(): Promise<Partial<DBBook>[]> {
  log('Selecting books from DB...');
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
