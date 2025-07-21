import {
  FB2_GENRES_ALIASES,
  MAX_BOOK_SEARCH_RESULTS,
} from '@book-play/constants';
import {
  AdvancedSearchParams,
  BasicBookData,
  BookData,
  DBAuthor,
  DBAuthorSummary,
  DBBook,
} from '@book-play/models';
import {
  getJsonGzFileName,
  readZippedFile,
  SQLQueryBuilder,
} from '@book-play/utils-node';
import { environment } from 'environments/environment.ts';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export default class BooksAPIApp {
  public async authorSummary(id: string): Promise<DBAuthorSummary> {
    const sqlQuery = new SQLQueryBuilder()
      .select('id', 'first', 'last', 'about', 'image')
      .from('authors')
      .where(`id = ${id}`)
      .build();
    // log(sqlQuery);

    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, async (err, result: DBAuthor[]) => {
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
      });
    });
  }

  randomAuthors(
    number: string | number = environment.RANDOM_AUTHORS_COUNT
  ): Promise<DBAuthorSummary[]> {
    const sqlQuery = `WITH RandomRows AS (
          SELECT id FROM authors ORDER BY RAND() LIMIT 50
        )
         SELECT RandomRows.id
         FROM RandomRows
                JOIN authors WHERE RandomRows.id = authors.id AND authors.image != '' AND authors.about != '' LIMIT ${number};`;
    //log(sqlQuery);

    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, (err, authors: Partial<DBAuthor>[]) => {
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
      });
    });
  }
  randomBookIds(
    number: string | number = environment.RANDOM_BOOKS_COUNT
  ): Promise<string[]> {
    const sqlQuery = `WITH RandomRows AS (
          SELECT id FROM books ORDER BY RAND() LIMIT 50
        )
        SELECT RandomRows.id
        FROM RandomRows
        JOIN books WHERE RandomRows.id = books.id AND books.cover != '' AND books.annotation != '' AND books.rating > 0 LIMIT ${number};`;
    // log(sqlQuery);

    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, (err, result: { id: string }[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result.map((item) => item.id.toString()));
        }
      });
    });
  }

  authorBooks(authorId: string): Promise<Partial<DBBook>[]> {
    const sqlQuery = new SQLQueryBuilder()
      .select('id', 'name', 'genres')
      .from('books')
      .where(`authorId = "${authorId}"`)
      .orderBy('name')
      .build();
    // log(sqlQuery);

    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, (err, result: Partial<DBBook>[]) => {
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
    const sqlQuery = `SELECT
          books.id, books.name, books.annotation, books.genres, books.date,
            books.full, books.cover, books.rating,
          authors.first, authors.last, authors.id as authorId 
          FROM books
          CROSS JOIN authors
          WHERE authors.id = books.authorId
          AND books.id = ${id}`;
    // log(sqlQuery);

    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, (err, result: Partial<DBBook>[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else if (result.length === 0) {
          reject('Book not found with id: ' + id);
        } else {
          resolve(result[0]);
        }
      });
    });
  }

  bookSearch(query: string): Promise<BasicBookData[]> {
    const sqlQuery = new SQLQueryBuilder()
      .select('id', 'full')
      .from('books')
      .where(`MATCH (full) AGAINST ('${query}')`)
      .build();

    // log(sqlQuery);

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

  advancedSearch(params: AdvancedSearchParams): Promise<BookData[]> {
    const hasRating = params.rating > 0;
    const hasGenres = params.genres.length > 0;

    let operator = ' AND ';
    if (params.mode === 'or') {
      operator = ' OR ';
    }
    const select = ['B.id', 'B.full'];
    if (hasRating) {
      select.push('B.rating');
    }
    if (hasGenres) {
      select.push('B.genres');
    }
    let builder = new SQLQueryBuilder().select(...select);
    builder = builder
      .from('books AS B')
      .leftJoin('genres AS G', 'G.bookId = B.id');

    if (hasRating) {
      builder = builder.where('B.rating > ' + params.rating);
    }

    const whereGenreAliases = [];
    if (hasGenres) {
      if (hasRating) {
        whereGenreAliases.push(operator);
      }
      whereGenreAliases.push(
        params.genres
          .map((genre) => {
            const aliases = [genre];
            if (FB2_GENRES_ALIASES[genre]) {
              aliases.push(...FB2_GENRES_ALIASES[genre]);
            }
            return (
              '(' +
              aliases.map((item) => `G.genre = '${item}'`).join(' OR ') +
              ')'
            );
          })
          .join(operator)
      );
    }
    const sqlQuery =
      builder.build() +
      whereGenreAliases.join('') +
      ` ORDER BY rating LIMIT ${MAX_BOOK_SEARCH_RESULTS}`;

    // log(sqlQuery);

    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, (err, result: BookData[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
