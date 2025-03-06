import { DBBook } from '@book-play/models';
import { Pool } from 'mysql2';

export function addToDataBase(pool: Pool, book: DBBook): Promise<string> {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO books (first, middle, last, name, annotation, genres, date, full, cover, paragraphs)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
        book.paragraphs,
      ],
      (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(book.full);
        }
      }
    );
  });
}
