import { DBBook } from '@book-play/models';
import { Pool } from 'mysql2';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';

export function saveToDataBase(pool: Pool, book: DBBook): Promise<string> {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO books (first, middle, last, name, annotation, genres, date, full, cover)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        book.first,
        book.middle || '',
        book.last,
        book.name,
        book.annotation || '',
        book.genres || '[]',
        book.date || '',
        book.full,
        book.cover || '',
      ],
      (err: Error, result: ResultSetHeader) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId.toString());
        }
      }
    );
  });
}
