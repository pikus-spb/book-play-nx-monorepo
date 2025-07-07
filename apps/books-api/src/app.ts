import {
  BasicBookData,
  DBAuthor,
  DBAuthorSummary,
  DBBook,
} from '@book-play/models';
import { getJsonGzFileName, readZippedFile } from '@book-play/utils-node';
import { environment } from 'environments/environment.ts';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export default class BooksAPIApp {
  async authorSummary(id: string): Promise<DBAuthorSummary> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT id, first, last, about, image FROM authors WHERE id = ' + id,
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

  randomAuthors(
    number: string | number = environment.RANDOM_AUTHORS_COUNT
  ): Promise<DBAuthorSummary[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        `WITH RandomRows AS (
          SELECT id FROM authors ORDER BY RAND() LIMIT 50
        )
         SELECT RandomRows.id
         FROM RandomRows
                JOIN authors WHERE RandomRows.id = authors.id AND authors.image != '' AND authors.about != '' LIMIT ${number};`,
        (err, authors: Partial<DBAuthor>[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(
              Promise.all(
                authors.map((author) => {
                  return this.authorSummary(author.id);
                })
              )
            );
          }
        }
      );
    });
  }
  randomBookIds(
    number: string | number = environment.RANDOM_BOOKS_COUNT
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        `WITH RandomRows AS (
          SELECT id FROM books ORDER BY RAND() LIMIT 50
        )
        SELECT RandomRows.id
        FROM RandomRows
        JOIN books WHERE RandomRows.id = books.id AND books.cover != '' AND books.annotation != '' AND books.rating > 0 LIMIT ${number};`,
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
    const query = `SELECT id, name, genres FROM books WHERE authorId = "${authorId}" ORDER BY name`;

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

  bookSearch(query: string): Promise<BasicBookData[]> {
    const sqlQuery = `SELECT books.id, books.full FROM books WHERE MATCH (full) AGAINST ('${query}')`;

    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, (err, result: BasicBookData[]) => {
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
    try {
      const book = await this.bookSummaryById(id);
      book.paragraphs = JSON.parse(
        readZippedFile(getJsonGzFileName(environment.BOOKS_JSON_PATH + id))
      );

      return book;
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  bookSummaryById(id: string): Promise<Partial<DBBook>> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          books.id, books.name, books.annotation, books.genres, books.date,
            books.full, books.cover, books.rating,
          authors.first, authors.last, authors.id as authorId 
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
}
