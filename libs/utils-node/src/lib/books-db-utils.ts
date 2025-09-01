import { QueryError, ResultSetHeader } from 'mysql2';
import { Pool as BasePool } from 'mysql2/typings/mysql/lib/Pool';

export function addGenres(
  pool: BasePool,
  bookId: string,
  genres: string[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    Promise.all(
      genres.map((genre) => {
        return new Promise((resolveChild) => {
          pool.query(
            'INSERT INTO genres (bookId, genre) ' + ' VALUES (?, ?)',
            [bookId, genre],
            (err: QueryError | null, result: ResultSetHeader) => {
              if (err) {
                reject(err);
              } else {
                resolveChild(result.insertId.toString());
              }
            }
          );
        });
      })
    ).then(() => resolve());
  });
}
