import fs from 'fs';
import * as win1251 from 'windows-1251';

export function readFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, null, (err: Error, data: string) => {
      if (err) {
        reject(err);
      } else {
        try {
          const encoding = data
            .toString()
            .match(/encoding="([^"]+)"/)[1]
            .toLowerCase();

          if (encoding === 'windows-1251') {
            data = win1251.decode(data);
            data = data.replace('windows-1251', 'UTF-8');
          }
        } catch (e) {
          reject(e);
        }
        resolve(data);
      }
    });
  });
}
