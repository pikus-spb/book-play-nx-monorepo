import { Book } from '@book-play/models';
import { log } from '@book-play/utils-common';
import { readFile } from '@book-play/utils-node';
import { CheerioAPI } from 'cheerio';
import { parser } from './app';

export async function jquery(file: string): Promise<CheerioAPI> {
  log('Parsing ' + file + '..');
  const text = await readFile(file);
  return parser.loadCheeroApi(text);
}

export async function getBookData(
  file: string
): Promise<{ lang: string; book: Book }> {
  const $ = await jquery(file);
  const lang = parser.getLanguage($);
  const book = parser.getBook($);
  return { lang, book };
}
