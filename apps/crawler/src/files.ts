import fs from 'fs';
import path from 'path';
import { workingDirectory } from './app.ts';

export function findFiles(ext: string): Promise<string[]> {
  console.log(`Start looking for ${ext} files....`);
  return new Promise((resolve, reject) => {
    getDirectoryListing(
      workingDirectory,
      ext,
      (err: Error, results: string[]) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        console.log(`Found ${results.length} ${ext} files.`);
        resolve(results);
      }
    );
  });
}

export function getDirectoryListing(
  dir: string,
  extension: string,
  done: (err: Error, results: string[]) => void
) {
  let results = [];
  fs.readdir(dir, (err, list) => {
    const next = () => {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          getDirectoryListing(file, extension, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith(extension)) {
            console.log('Found: ' + file + '...');
            results.push(file);
          }
          next();
        }
      });
    };

    if (err) {
      return done(err, []);
    }
    let i = 0;
    next();
  });
}

export function deleteFiles(files: string[]) {
  for (const file of files) {
    fs.unlinkSync(file);
    console.log('Deleted: ' + file);
  }
}
