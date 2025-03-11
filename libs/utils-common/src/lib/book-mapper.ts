import { Author, Book, DBBook, ImageBase64Data } from '@book-play/models';

export function DBBookToUIBook(input: Partial<DBBook>): Book {
  const data = {
    id: input.id,
    name: input.name,
    annotation: input.annotation,
    genres: JSON.parse(input.genres || '[]'),
    date: input.date,
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
    annotation: input.annotation,
    genres: JSON.stringify(input.genres),
    date: input.date,
    paragraphs: JSON.stringify(input.paragraphs),
    cover: input.cover?.toBase64String() || '',
    first: input.author.firstName,
    last: input.author.lastName,
    middle: input.author.middleName || '',
    full: input.fullName,
  };
}
