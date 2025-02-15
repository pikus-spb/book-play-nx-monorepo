import { DB_CONFIG } from '@book-play/constants';
import { DBAuthorBooks, DBBook } from '@book-play/models';
import { getAuthorName } from '@book-play/utils';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(DB_CONFIG as unknown as PoolOptions);

export default class BooksAPIApp {
  public all(): Promise<DBBook[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT id, first, middle, last, name, full FROM books ORDER BY full ASC',
        (err, result: DBBook[]) => {
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

  groupedByAuthor(): Promise<DBAuthorBooks> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT id, first, last, name, full FROM books',
        (err, result: DBBook[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(
              Array.from(result).reduce((memo, book) => {
                const authorName = getAuthorName(book);
                if (!memo[authorName]) {
                  memo[authorName] = [];
                }
                memo[authorName].push(book);

                return memo;
              }, {})
            );
          }
        }
      );
    });
  }

  byId(id: string): Promise<DBBook> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, first, middle, last, name, full, cover, paragraphs  FROM books WHERE id = ${id}`,
        (err, result: DBBook[]) => {
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

  search(pattern: string): Promise<DBBook[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, first, last, name, full FROM books WHERE full LIKE '%${pattern}%'`,
        (err: Error, result: DBBook[]) => {
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
}
