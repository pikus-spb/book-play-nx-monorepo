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
