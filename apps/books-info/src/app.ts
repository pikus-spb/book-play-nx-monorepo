import { DBBook } from '@book-play/models';
import { BookInfo, SearchBook } from '@book-play/scraper';
import { log } from '@book-play/utils-common';
import { environment } from 'environments/environment';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export async function run() {
  const scrapper = new SearchBook();
  await scrapper.init();
  const count = await countBooksToUpdate();

  log(`Found ${JSON.stringify(count)} books...`);

  for (let i = 0; i < count; i++) {
    const book = await getBookByIndex(i);

    log('Searching book: ' + book.full + ' ...\n\r');

    let bookInfo: BookInfo;
    try {
      bookInfo = await scrapper.searchBook(book.full);
    } catch (e) {
      log(e);
      continue;
    }

    if (!bookInfo || !bookInfo.rating) {
      continue;
    }

    console.log('Adding info about ' + book.full + '\n' + bookInfo.rating);

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

    log('Added successfully.\n\r\n\r');
  }

  await scrapper.finalize();
  console.log('Done. Added info about ' + count + ' books.');
}

async function countBooksToUpdate(): Promise<number> {
  return new Promise((resolve, reject) => {
    pool.query(
      'select count(id) from books;',
      (err: Error, result: Record<string, number>[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(Object.values(result[0])[0]);
        }
      }
    );
  });
}

async function getBookByIndex(index: number): Promise<DBBook> {
  return new Promise((resolve, reject) => {
    pool.query(
      `select id, full from books limit ${index}, 1;`,
      (err: Error, result: DBBook[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result[0]);
        }
      }
    );
  });
}
