import { Book, DBBook } from './book';
import { DBBookToUIBook } from './book-mapper';

export interface DBAuthor {
  id?: string;
  first: string;
  last: string;
  full: string;
  about?: string;
  image?: string;
}

export interface DBAuthorByGenre {
  id: string;
  full: string;
  genres: string;
}

export interface AuthorByGenre {
  id: string;
  full: string;
  genres: string[];
}

export interface DBAuthorSummary extends DBAuthor {
  books: Partial<DBBook>[];
}

export class Author {
  public id!: string;
  public first!: string;
  public last!: string;
  public about?: string;
  public image?: string;

  constructor(obj: Partial<DBAuthor>) {
    Object.assign(this, { ...obj });
    this.about = this.about?.replace('\n', '<br><br>');
  }

  public get full(): string {
    return `${this.first} ${this.last}`;
  }
}

export class AuthorSummary extends Author {
  books: Partial<Book>[] = [];
  genres: string[] = [];

  constructor(obj: Partial<DBAuthorSummary>) {
    super(obj);

    if (obj.books) {
      this.books = obj.books.map((book: Partial<DBBook>) =>
        DBBookToUIBook(book)
      );
      this.genres = [
        ...new Set([
          ...obj.books.map((book) => JSON.parse(book.genres || '[]')).flat(),
        ]),
      ];
    }
  }
}
