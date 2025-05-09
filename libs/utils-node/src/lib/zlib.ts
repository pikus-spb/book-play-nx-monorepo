import fs from 'fs';
import * as zlib from 'node:zlib';

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
