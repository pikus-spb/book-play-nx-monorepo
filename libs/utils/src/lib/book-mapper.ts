import { Author, Book, DBBook, ImageBase64Data } from '@book-play/models';
import { capitalizeFirstLetter, cleanHTML, cleanSpaces } from './cleanup-tools';

export function DBBookToUIBook(input: Partial<DBBook>): Book {
  const data = {
    id: input.id,
    name: input.name,
    paragraphs: JSON.parse(input.paragraphs || '[]'),
    cover: ImageBase64Data.fromBase64String(input.cover || ''),
    author: new Author({
      middleName: input.middle,
      lastName: input.last!,
      firstName: input.first!,
    }),
  };
  return new Book(data);
}

export function UIBookToDBBook(input: Book): DBBook {
  return {
    id: input.id || '',
    name: input.name,
    paragraphs: JSON.stringify(input.paragraphs),
    cover: input.cover?.toBase64String() || '',
    first: input.author.firstName,
    last: input.author.lastName,
    middle: input.author.middleName || '',
    full: input.fullName,
  };
}

export function getAuthorName(author: Author): string;
export function getAuthorName(book: DBBook): string;
export function getAuthorName(input: Author | DBBook): string {
  let result;
  if (input instanceof Author) {
    result = [input.firstName, input.middleName || '', input.lastName];
  } else {
    result = [input.first, input.middle || '', input.last];
  }

  return cleanSpaces(
    cleanHTML(result.map((item) => capitalizeFirstLetter(item)).join(' '))
  );
}
