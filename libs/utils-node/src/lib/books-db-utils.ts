import { DBBook } from '@book-play/models';
import { Pool as BasePool } from 'mysql2/typings/mysql/lib/Pool';

export async function countRows(
  pool: BasePool,
  tableName: string,
  whereClause = ''
): Promise<number> {
  return new Promise((resolve, reject) => {
    pool.query(
      `select count(id) from ${tableName} ${
        whereClause ? 'WHERE ' + whereClause : ''
      };`,
      (err: Error, result: Record<string, number>[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(Object.values(result[0])[0]);
        }
      }
    );
  });
}

export async function getBookByIndex(
  pool: BasePool,
  index: number,
  selectClause = '*',
  whereClause = ''
): Promise<DBBook> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT ${selectClause} FROM books ${whereClause} LIMIT ${index}, 1;`,
      (err: Error, result: DBBook[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result?.[0]);
        }
      }
    );
  });
}
