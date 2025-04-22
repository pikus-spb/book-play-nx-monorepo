import { Author } from './author';
import { ImageBase64Data } from './base64';
import { Book, DBBook } from './book';

export function DBBookToUIBook(input: Partial<DBBook>): Book {
  const data = {
    id: input.id,
    authorId: input.authorId,
    name: input.name,
    annotation: (input.annotation || '').replace('\n', '<br><br>'),
    genres: JSON.parse(input.genres || '[]'),
    date: input.date,
    paragraphs: JSON.parse(input.paragraphs || '[]'),
    cover: ImageBase64Data.fromBase64String(input.cover || ''),
    author: new Author({
      id: input.authorId,
      last: input?.last,
      first: input.first,
    }),
  };
  return new Book(data);
}

export function UIBookToDBBook(input: Book): DBBook {
  return {
    id: input.id || '',
    authorId: input.authorId || '',
    name: input.name,
    annotation: input.annotation,
    genres: JSON.stringify(input.genres),
    date: input.date,
    paragraphs: JSON.stringify(input.paragraphs),
    cover: input.cover?.toBase64String() || '',
    first: input.author.first,
    last: input.author.last,
    full: input.full,
  };
}
