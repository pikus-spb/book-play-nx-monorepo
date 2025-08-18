import { BookInfo, SearchBook } from '@book-play/scraper';
import { error, log } from '@book-play/utils-common';
import { countRows, getBookByIndex } from '@book-play/utils-node';
import { environment } from 'environments/environment';
import mysql, { escape, PoolOptions } from 'mysql2';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export async function run() {
  const scrapper = new SearchBook();
  await scrapper.init();
  const count = await countRows(pool, 'books');

  log(`Found ${JSON.stringify(count)} books...`);

  for (let i = 0; i < count; i++) {
    const book = await getBookByIndex(
      pool,
      i,
      '*',
      "WHERE rating IS NULL OR annotation = ''"
    );
    if (!book) {
      continue;
    }

    log('Searching book: ' + book.full + ' ...');

    const bookInfo: BookInfo = {
      rating: book.rating || 0,
      annotation: book.annotation || 'н/д',
    };

    await scrapper.finalize();
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
  }

  await scrapper.finalize();
  console.log('Done. Added info about ' + count + ' books.');
}
