import { DB_CONFIG } from '@book-play/constants';
import { DBAuthor, DBBook } from '@book-play/models';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(DB_CONFIG as unknown as PoolOptions);

export default class BooksAPIApp {
  authors(): Promise<DBAuthor[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT DISTINCT first, last FROM books ORDER BY full',
        (err, result: Partial<DBBook>[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result.map((book) => Object.values(book) as DBAuthor));
          }
        }
      );
    });
  }

  randomAuthors(number = '3'): Promise<DBAuthor[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT DISTINCT first, last FROM books ORDER BY RAND() LIMIT ${number}`,
        (err, result: Partial<DBBook>[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result.map((book) => Object.values(book) as DBAuthor));
          }
        }
      );
    });
  }
  randomBookIds(number = '3'): Promise<string[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id FROM books ORDER BY RAND() LIMIT ${number}`,
        (err, result: { id: string }[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result.map((item) => item.id.toString()));
          }
        }
      );
    });
  }

  authorBooks(name: string): Promise<Partial<DBBook>> {
    name = name.split(' ').join('');
    const query = `SELECT id, name FROM books WHERE CONCAT(REPLACE(first,' ',''), REPLACE(last,' ','')) = "${name}"`;

    return new Promise((resolve, reject) => {
      pool.query(query, (err, result: Partial<DBBook>) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  bookSummaryById(id: string): Promise<DBBook> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, first, middle, last, name, annotation, genres, date, full, cover FROM books WHERE id = ${id}`,
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
