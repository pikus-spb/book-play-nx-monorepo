import { Book } from '@book-play/models';
import { Pool } from 'mysql2';

export function addToDataBase(pool: Pool, book: Book): Promise<string> {
  console.log('Adding to database: ' + book.fullName);
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO books (authorFirstName, authorMiddleName, authorLastName, title, bookFullName, logo, content)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        book.author.firstName,
        book.author.middleName,
        book.author.lastName,
        book.name,
        book.fullName,
        book.cover ? book.cover.toBase64String() : '',
        book.xml,
      ],
      (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(book.fullName);
        }
      }
    );
  });
}
