import { DBAuthor, DBBook } from '@book-play/models';
import { escape } from 'mysql2';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';
import { pool } from './app.ts';

export function saveToDataBase(
  book: DBBook,
  author: DBAuthor
): Promise<string> {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO authors (first, last, full, about, image)' +
        ' VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id',
      [author.first, author.last, author.full, author.about, author.image],
      async (err: Error, result: ResultSetHeader) => {
        if (err) {
          reject(err);
        } else {
          let authorId = result.insertId;
          if (authorId === 0) {
            authorId = await new Promise((resolve, reject) => {
              pool.query(
                `SELECT id FROM authors WHERE first = ${escape(
                  author.first
                )} AND last = ${escape(author.last)} LIMIT 1`,
                (err: Error, result: { id: number }[]) => {
                  if (err) {
                    reject(err);
                  } else if (result.length === 0) {
                    reject('Author not found ' + author.full);
                  } else {
                    resolve(Number(result[0].id));
                  }
                }
              );
            });
          }

          pool.query(
            'INSERT INTO books (authorId, name, annotation, genres, date, full, cover)' +
              ' VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              authorId,
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
        }
      }
    );
  });
}
