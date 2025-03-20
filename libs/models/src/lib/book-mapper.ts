import { Author } from './author';
import { Book, DBBook } from './book';
import { ImageBase64Data } from './imageBase64Data';

export function DBBookToUIBook(input: Partial<DBBook>): Book {
  const data = {
    id: input.id,
    authorId: input.authorId,
    name: input.name,
    annotation: input.annotation,
    genres: JSON.parse(input.genres || '[]'),
    date: input.date,
    paragraphs: JSON.parse(input.paragraphs || '[]'),
    cover: ImageBase64Data.fromBase64String(input.cover || ''),
    author: new Author({
      id: input.authorId,
      middle: input.middle,
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
    middle: input.author.middle || '',
    full: input.full,
  };
}
