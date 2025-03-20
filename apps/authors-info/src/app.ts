import { DB_CONFIG } from '@book-play/constants';
import { DBAuthor } from '@book-play/models';
import { searchAuthor } from '@book-play/scraper';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(DB_CONFIG as unknown as PoolOptions);

export async function run() {
  const authors: DBAuthor[] = await getAuthorsToUpdate();

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];

    console.log('Searching author: ' + author.full + ' ...\n\r');

    const authorInfo = await searchAuthor(author.first, author.last);

    if (authorInfo && (authorInfo.about !== '' || authorInfo.imageUrl !== '')) {
      console.log(
        'Adding info about ' +
          author.full +
          '\n' +
          (authorInfo.about || '(empty)')
      );

      await new Promise((resolve, reject) => {
        pool.query(
          "UPDATE authors SET about='" +
            authorInfo.about.replace("'", "\\'") +
            "', image='" +
            authorInfo.imageUrl.replace("'", "\\'") +
            "' WHERE id=" +
            author.id,
          (err: Error) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
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
  }

  console.log('Done. Added info about ' + authors.length + ' authors.');
}

async function getAuthorsToUpdate(): Promise<DBAuthor[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT id, first, last, full FROM authors WHERE about = "" AND image = ""',
      (err: Error, result: DBAuthor[]) => {
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
