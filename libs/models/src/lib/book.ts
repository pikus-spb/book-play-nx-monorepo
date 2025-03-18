import { filterTextParagraphs } from '@book-play/utils-browser';
import { Author } from './author';
import { ImageBase64Data } from './imageBase64Data';

export interface DBBook {
  id: string;
  authorId: string;
  first: string;
  middle?: string;
  last: string;
  name: string;
  annotation?: string;
  genres?: string;
  date?: string;
  full: string;
  cover?: string;
  paragraphs: string;
}

export class Book {
  public id?: string;
  public authorId?: string;
  public author!: Author;
  public name!: string;
  public annotation?: string;
  public genres?: string[];
  public date?: string;
  public cover?: ImageBase64Data;
  public paragraphs!: string[];
  public _textParagraphs: string[] = [];

  constructor(obj: Partial<Book>) {
    Object.assign(this, obj, {});
    if (obj.author) {
      this.author = new Author(obj.author);
    }
    if (obj.cover) {
      this.cover = new ImageBase64Data(obj.cover);
    }
  }

  public get textParagraphs(): string[] {
    if (this._textParagraphs.length === 0) {
      this._textParagraphs = filterTextParagraphs(this.paragraphs);
    }
    return this._textParagraphs;
  }

  public get full(): string {
    return `${this.author.full} - ${this.name}`;
  }

  public get hash(): string {
    return `${this.author.first}${this.author.middle}${this.author.last}${this.name}${this.paragraphs.length}`;
  }
}
