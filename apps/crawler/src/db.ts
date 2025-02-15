import { DBBook } from '@book-play/models';
import { Pool } from 'mysql2';

export function addToDataBase(pool: Pool, book: DBBook): Promise<string> {
  console.log('Adding to database: ' + book.full);
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO books (first, middle, last, name, full, cover, paragraphs)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        book.first,
        book.middle || '',
        book.last,
        book.name,
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
