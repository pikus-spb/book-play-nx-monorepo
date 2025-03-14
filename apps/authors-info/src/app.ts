import { BOOKS_API_URL, DB_CONFIG } from '@book-play/constants';
import { DBAuthor } from '@book-play/models';
import { AuthorInfo, searchAuthor } from '@book-play/scraper';
import mysql, { PoolOptions } from 'mysql2';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';

const pool = mysql.createPool(DB_CONFIG as unknown as PoolOptions);

export async function run() {
  const authors: DBAuthor[] = await getAuthorsToUpdate();

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];

    console.log('Searching author: ' + author.join(' ') + ' ...');

    const authorInfo: AuthorInfo = (await searchAuthor(
      author[0],
      author[1]
    )) ?? { imageUrl: '', about: '' };

    console.log(
      'Adding info about ' +
        author.join(' ') +
        '\n' +
        (authorInfo.about || '(empty)')
    );

    await new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO authors (first, last, full, about, image)' +
          ' VALUES (?, ?, ?, ?, ?)',
        [
          author[0],
          author[1],
          author.join(' '),
          authorInfo.about || '',
          authorInfo.imageUrl || '',
        ],
        (err: Error, result: ResultSetHeader) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId.toString());
          }
        }
      );
    })
      .then(() => {
        console.log('Added successfully.\n\r\n\r');
      })
      .catch((e) => {
        console.error(e);
        console.log('\n\r');
      });
  }

  console.log('Done. Added info about ' + authors.length + ' authors.');
}

async function getAuthorsToUpdate(): Promise<DBAuthor[]> {
  const allAuthors: DBAuthor[] = await fetch(BOOKS_API_URL + '/author/all')
    .then((response) => response.json())
    .catch((e) => {
      console.error(e);
    });

  const currentAuthors = (await getCurrentAuthors()).map((dbAuthor) =>
    dbAuthor.join('')
  );
  return allAuthors.filter((dbAuthor) => {
    return !currentAuthors.includes(dbAuthor.join(''));
  });
}

function getCurrentAuthors(): Promise<DBAuthor[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT first, last FROM authors',
      (err: Error, result: DBAuthor[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result.map((row) => Object.values(row) as DBAuthor));
        }
      }
    );
  });
}
