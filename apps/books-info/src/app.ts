import { BookInfo, SearchBook } from '@book-play/scraper';
import { log } from '@book-play/utils-common';
import { countRows, getBookByIndex } from '@book-play/utils-node';
import { environment } from 'environments/environment';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export async function run() {
  const scrapper = new SearchBook();
  await scrapper.init();
  const count = await countRows(pool, 'books');

  log(`Found ${JSON.stringify(count)} books...`);

  for (let i = 0; i < count; i++) {
    const book = await getBookByIndex(pool, i, '*', 'WHERE rating IS NULL');
    if (!book) {
      continue;
    }

    log('Searching book: ' + book.full + ' ...');

    let bookInfo: BookInfo;
    try {
      bookInfo = await scrapper.searchBook(book.full);
    } catch (e) {
      log(e);
      log('Reinit browser and retry...');
      await scrapper.finalize();
      await scrapper.init();
      i--;
      continue;
    }

    if (!bookInfo || !bookInfo.rating) {
      bookInfo = {
        rating: 0,
      };
    }

    try {
      await new Promise((resolve, reject) => {
        pool.query(
          `UPDATE books SET rating=${bookInfo.rating} WHERE id=${book.id}`,
          (err: Error) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          }
        );
      });
    } catch (e) {
      log(e + '\n\r');
    }

    log('Added successfully rating: ' + bookInfo.rating + '\n\r\n\r');
  }

  await scrapper.finalize();
  console.log('Done. Added info about ' + count + ' books.');
}
