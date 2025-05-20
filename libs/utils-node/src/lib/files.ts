import fs from 'fs';
import * as win1251 from 'windows-1251';

export function readFile(file: string, detectEncoding = true): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, null, (err: Error, data: string) => {
      if (err) {
        reject(err);
      } else {
        if (detectEncoding) {
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
        }

        resolve(data.toString());
      }
    });
  });
}

export function writeToFile(text: string, file: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, text, (err: Error) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export function getRandomFileName(
  extension: string,
  additionalPath = ''
): string {
  return __dirname + additionalPath + 'file-' + Math.random() + extension;
}
