import fs from 'fs';
import * as zlib from 'node:zlib';

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

export function readZippedFile(filename: string): string {
  const buffer = fs.readFileSync(filename);
  return zlib.gunzipSync(buffer).toString();
}

export function saveContentsToZipFile(data: string, zipFileName: string) {
  const compressedData = zlib.gzipSync(data);
  fs.writeFileSync(zipFileName, compressedData);
}

export function getJsonGzFileName(id: string): string {
  return id + '.json.gz';
}

export async function unzipFile(
  fileName: string,
  outputPath: string
): Promise<boolean> {
  try {
    await exec(`unzip ${fileName} -d ${outputPath}`);
    console.log('Unzipped ' + fileName + '...');
    return true;
  } catch (err) {
    console.error('Error occurred while unzipping:', err);
    return false;
  }
}
