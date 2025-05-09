import fs from 'fs';
import path from 'path';

export function getFilesNames(
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
          getFilesNames(file, extension, (err, res) => {
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
