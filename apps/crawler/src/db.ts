import { DBAuthor, DBBook } from '@book-play/models';
import { escape } from 'mysql2';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';
import { pool } from './app.ts';

export async function saveToDataBase(
  book: DBBook,
  author: DBAuthor
): Promise<string> {
  if (!book.authorId) {
    try {
      book.authorId = await insertAuthor(author);
    } catch (e) {
      console.error('Could not insert author: ' + author.full);
      throw e;
    }
  }

  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO books (authorId, name, annotation, genres, date, full, cover)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        book.authorId,
        book.name,
        book.annotation,
        book.genres,
        book.date,
        book.full,
        book.cover,
      ],
      (err: Error, result: ResultSetHeader) => {
        if (err) {
          reject(err);
        } else {
          const bookId = result.insertId.toString();
          resolve(bookId);
        }
      }
    );
  });
}

export function queryAuthorId(authorFullName: string): Promise<number> {
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

export function insertAuthor(author: DBAuthor): Promise<string> {
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
