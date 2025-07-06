import { Author, DBAuthor } from './author';
import { ImageBase64Data } from './base64';
import { Book, DBBook } from './book';

export function DBBookToUIBook(book: Partial<DBBook>): Book {
  const data = {
    id: book.id,
    authorId: book.authorId,
    name: book.name,
    annotation: (book.annotation || '').replace('\n', '<br><br>'),
    genres: JSON.parse(book.genres || '[]'),
    date: book.date,
    rating: book.rating,
    paragraphs: JSON.parse(book.paragraphs || '[]'),
    cover: ImageBase64Data.fromBase64String(book.cover || ''),
    author: new Author({
      id: book.authorId,
      first: book.first,
      last: book.last,
    }),
  };
  return new Book(data);
}

export function UIBookToDBBook(input: Book): DBBook {
  return {
    id: input.id || '',
    first: input.author.first,
    last: input.author.last,
    authorId: input.authorId || '',
    name: input.name,
    annotation: input.annotation,
    genres: JSON.stringify(input.genres),
    date: input.date,
    paragraphs: JSON.stringify(input.paragraphs),
    cover: input.cover?.toBase64String() || '',
    full: input.full,
    rating: input.rating,
  };
}

export function UIAuthorToDBAuthor(input: Author): DBAuthor {
  return {
    id: input.id || '',
    first: input.first,
    last: input.last,
    full: input.full,
    about: input.about ?? '',
    image: input.image ?? '',
  };
}
