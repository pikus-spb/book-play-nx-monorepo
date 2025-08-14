import { DBAuthor, DBBook, Genre } from '@book-play/models';
import { error, log } from '@book-play/utils-common';
import { addGenres } from '@book-play/utils-node';
import { escape } from 'mysql2';
import { Pool as BasePool } from 'mysql2/typings/mysql/lib/Pool';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';

export async function saveToDataBase(
  pool: BasePool,
  book: DBBook,
  author: DBAuthor
): Promise<string> {
  if (!book.authorId) {
    try {
      book.authorId = await insertAuthor(pool, author);
    } catch (e) {
      error('Could not insert author: ' + author.full);
      throw e;
    }
  }

  log('Saving book to database...');

  const bookId: string = await new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO books (authorId, name, annotation, genres, date, full, cover, rating)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        book.authorId,
        book.name,
        book.annotation,
        book.genres,
        book.date,
        book.full,
        book.cover,
        book.rating,
      ],
      (err: any, result: ResultSetHeader) => {
        if (err) {
          error(err);
          reject(err);
        } else {
          resolve(result.insertId.toString());
        }
      }
    );
  });

  const genres: Genre[] = JSON.parse(book.genres).filter(
    (genre: Genre) => genre.length < 50
  );
  if (genres && genres.length > 0) {
    log('Adding Genres...');
    await addGenres(pool, bookId, genres).catch((err) => {
      error(err);
    });
  }

  return bookId;
}

export function queryAuthorId(
  pool: BasePool,
  authorFullName: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id FROM authors WHERE full = ${escape(authorFullName)} LIMIT 1`,
      (err: Error, result: { id: number }[]) => {
        if (err) {
          reject(err);
        } else if (result.length === 0) {
          resolve(-1);
        } else {
          resolve(result[0].id);
        }
      }
    );
  });
}

export function insertAuthor(
  pool: BasePool,
  author: DBAuthor
): Promise<string> {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO authors (first, last, full, image, about) VALUES (?, ?, ?, ?, ?)',
      [author.first, author.last, author.full, author.image, author.about],
      (err: Error, result: ResultSetHeader) => {
        if (err) {
          reject(err);
        } else {
          resolve(String(result.insertId));
        }
      }
    );
  });
}
