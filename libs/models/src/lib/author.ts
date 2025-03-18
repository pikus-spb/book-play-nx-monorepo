import { DBBook } from './book';

export interface DBAuthor {
  id?: string;
  first: string;
  middle?: string;
  last: string;
  full: string;
  about?: string;
  image?: string;
}

export interface DBAuthorSummary extends DBAuthor {
  books: Partial<DBBook>[];
}

export class Author {
  public id!: string;
  public first!: string;
  public middle?: string;
  public last!: string;
  public about?: string;
  public image?: string;

  constructor(obj: Partial<DBAuthor>) {
    Object.assign(this, { ...obj });
  }

  public get full(): string {
    return `${this.first} ${this.middle ? this.middle + ' ' : ''}${this.last}`;
  }
}
