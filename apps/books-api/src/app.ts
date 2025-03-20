import { BOOKS_JSON_PATH, DB_CONFIG } from '@book-play/constants';
import { DBAuthor, DBAuthorSummary, DBBook } from '@book-play/models';
import fs from 'fs';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(DB_CONFIG as unknown as PoolOptions);

export default class BooksAPIApp {
  authors(): Promise<Partial<DBAuthor>[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT id, first, last FROM authors ORDER BY full',
        (err, result: Partial<DBAuthor>[]) => {
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

  async authorSummary(id: string): Promise<DBAuthorSummary> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT first, middle, last, about, image FROM authors WHERE id = ' +
          id,
        async (err, result: DBAuthor[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            const author = result[0];
            if (result.length > 0) {
              (author as DBAuthorSummary).books = await this.authorBooks(id);
              resolve(author as DBAuthorSummary);
            }

            resolve({} as DBAuthorSummary);
          }
        }
      );
    });
  }

  randomAuthors(number = '3'): Promise<Partial<DBAuthor>[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, first, last FROM authors ORDER BY RAND() LIMIT ${number}`,
        (err, result: Partial<DBAuthor>[]) => {
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

  authorBooks(authorId: string): Promise<Partial<DBBook>[]> {
    const query = `SELECT id, name, genres FROM books WHERE authorId = "${authorId}"`;

    return new Promise((resolve, reject) => {
      pool.query(query, (err, result: Partial<DBBook>[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async bookById(id: string): Promise<Partial<DBBook>> {
    const book = await this.bookSummaryById(id);
    book.paragraphs = JSON.parse(
      fs.readFileSync(BOOKS_JSON_PATH + id + '.json').toString()
    ).paragraphs;

    return book;
  }

  bookSummaryById(id: string): Promise<Partial<DBBook>> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          books.id, books.name, books.annotation, books.genres, books.date,
            books.full, books.cover,
          authors.first, authors.middle, authors.last, authors.id as authorId 
          FROM books
          CROSS JOIN authors
          WHERE authors.id = books.authorId
          AND books.id = ${id}`,
        (err, result: Partial<DBBook>[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else if (result.length === 0) {
            reject('Book not found with id: ' + id);
          } else {
            resolve(result[0]);
          }
        }
      );
    });
  }

  /*
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
*/
}
