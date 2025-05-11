import { readFile } from '@book-play/utils-node';
import { CheerioAPI } from 'cheerio';
import { parser } from './app';

export async function jquery(file: string): Promise<CheerioAPI> {
  console.log('Parsing ' + file + '..');
  const text = await readFile(file);
  return parser.loadCheeroApi(text);
}
