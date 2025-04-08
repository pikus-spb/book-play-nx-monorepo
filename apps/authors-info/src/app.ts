import { DBAuthor } from '@book-play/models';
import { searchAuthor } from '@book-play/scraper';
import { environment } from 'environments/environment';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(environment.DB_CONFIG as unknown as PoolOptions);

export async function run() {
  const authors: DBAuthor[] = await getAuthorsToUpdate();

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];

    console.log('Searching author: ' + author.full + ' ...\n\r');

    let authorInfo = await searchAuthor(author.first, author.last);

    if (!authorInfo) {
      authorInfo = {
        imageUrl: '',
        about: '',
      };
    }

    console.log(
      'Adding info about ' +
        author.full +
        '\n' +
        authorInfo.about +
        '\n' +
        authorInfo.imageUrl
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

  console.log('Done. Added info about ' + authors.length + ' authors.');
}

async function getAuthorsToUpdate(): Promise<DBAuthor[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT id, first, last, full FROM authors',
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
