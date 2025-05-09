import { DBAuthor, DBBook } from '@book-play/models';
import { Pool } from 'mysql2';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';

export function saveToDataBase(
  pool: Pool,
  book: DBBook,
  author: DBAuthor
): Promise<string> {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO authors (first, last, full, about, image)' +
        ' VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id',
      [author.first, author.last, author.full, author.about, author.image],
      (err: Error, result: ResultSetHeader) => {
        if (err) {
          reject(err);
        } else {
          const authorId = result.insertId.toString();
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
