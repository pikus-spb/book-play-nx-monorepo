import { workingDirectory } from './app.ts';
import { getFilesNames } from './files.ts';

export function findFiles(ext: string): Promise<string[]> {
  console.log(`Start looking for ${ext} files....`);
  return new Promise((resolve, reject) => {
    getFilesNames(workingDirectory, ext, (err: Error, results: string[]) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      console.log(`Found ${results.length} ${ext} files.`);
      resolve(results);
    });
  });
}
