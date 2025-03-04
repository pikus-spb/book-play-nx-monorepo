import { Book } from '@book-play/models';
import { load } from 'cheerio';
import LanguageDetect from 'languagedetect';

export function cleanSpaces(text: string): string {
  return text
    .trim()
    .replace(/&nbsp;/gi, ' ')
    .replace(/ {2,}/gi, ' ');
}

export function cleanHTMLAndCopyrights(text: string): string {
  text = cleanSpaces(cleanFootnotes(cleanHTML(text))).trim();
  if (
    text.startsWith('©') ||
    text.match(/авторские права/gi) ||
    text.match(/создание fb2/gi) ||
    text.match(/Издательство [а-я]+®/gi) ||
    text.match(/Издательство АЗБУКА/gi) ||
    text.match(/Royallib/gi) ||
    text.match(/Все книги автора/gi) ||
    text.match(/Эта же книга в других форматах/gi) ||
    text.match(/Приятного чтения!/gi) ||
    text.match(/Copyright ©/gi) ||
    text.match(/All rights reserved/gi) ||
    text.match(/Все права защищены/gi) ||
    text.match(/litres|литрес/gi)
  ) {
    return '';
  }

  return text;
}

export function cleanFootnotes(text: string): string {
  return text.replace(/\[\d+\]/g, '');
}

export function cleanHTML(text: string): string {
  return load(text).text();
}

export function capitalizeFirstLetter(text: string): string {
  text = text.toLowerCase();
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

export function detectLanguage(text: string): string {
  const result = new LanguageDetect()
    .detect(text, 3)
    .sort((o1: [string, number], o2: [string, number]) => {
      return o2[1] - o1[1];
    });
  return result[0]?.[0];
}

export function isBookInRussian(book: Book): boolean {
  const textSample = book.paragraphs.slice(0, 1).join('');
  return detectLanguage(textSample) === 'russian';
}

export function isTextInRussian(text: string): boolean {
  return !/[^\w\s]*\b[^а-яА-Я]+\b[^\w\s]*/g.test(text);
}

export function containsLetters(text: string): boolean {
  return /\S+/.test(text);
}

export function cleanNonRussianWords(text = ''): string {
  return cleanSpaces(text.replace(/[^\w\s]*\b[^а-яА-Я]+\b[^\w\s]*/g, ''));
}

export function findRussianIndex(text: string[]): number {
  const found = text.find((item) => isTextInRussian(item));
  return found ? text.indexOf(found) : -1;
}
