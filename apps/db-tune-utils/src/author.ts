import { environment } from '@book-play/constants';
import { DBBook } from '@book-play/models';
import mysql, { escape, PoolOptions } from 'mysql2';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export async function run() {
  const books: DBBook[] = await getBooksToUpdate();

  for (let i = 0; i < books.length; i++) {
    const book = books[i];

    console.log(`Updating ${book.first} ${book.last}`);

    let authorId: string | undefined = await searchAuthor(
      book.first,
      book.last
    ).catch((e) => {
      console.error(e);
      return undefined;
    });
    if (!authorId) {
      authorId = await insertNewAuthor(book).catch((e) => {
        console.error(e);
        return undefined;
      });
    }
    if (authorId !== undefined) {
      await updateBook(book.id, authorId).catch((e) => {
        console.error(e);
        return undefined;
      });
    }
  }

  pool.end();
  console.log('All done!');
}

function insertNewAuthor(author: any): Promise<string> {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO authors (first, last, full, about, image)' +
        ' VALUES (?, ?, ?, ?, ?)',
      [author.first, author.last, author.first + ' ' + author.last, '', ''],
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

function updateBook(id: string, authorId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE books SET authorId='" + authorId + "' WHERE id=" + id,
      (err: Error, result: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
}

async function getBooksToUpdate(): Promise<DBBook[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT id, authorId FROM books',
      (err: Error, result: any[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function searchAuthor(
  first: string,
  last: string
): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id FROM authors WHERE first = ${escape(
        first
      )} AND last = ${escape(last)} LIMIT 1`,
      (err: Error, result: any[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result?.[0]?.id);
        }
      }
    );
  });
}
