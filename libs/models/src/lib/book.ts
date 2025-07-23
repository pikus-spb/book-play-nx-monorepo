import { Author } from './author';
import { ImageBase64Data } from './base64';

export interface DBBook {
  id: string;
  authorId: string;
  first: string;
  last: string;
  name: string;
  annotation?: string;
  genres?: Genre;
  date?: string;
  full: string;
  cover?: string;
  rating?: number;
  paragraphs: string;
}

export interface BasicBookData {
  id: string;
  full: string;
}

export interface BookData extends BasicBookData {
  rating: number;
  genres: string;
}

export interface AdvancedSearchParams {
  genres: string[];
  rating: number;
}

export class Book {
  public id?: string;
  public authorId?: string;
  public author!: Author;
  public name!: string;
  public annotation?: string;
  public genres?: Genre[];
  public date?: string;
  public cover?: ImageBase64Data;
  public rating?: number;
  public paragraphs!: string[];
  public textParagraphs: string[] = [];

  constructor(obj: Partial<Book>) {
    Object.assign(this, obj, {});

    this.textParagraphs = filterTextParagraphs(this.paragraphs);

    if (obj.author) {
      this.author = new Author(obj.author);
    }
    if (obj.cover) {
      this.cover = new ImageBase64Data(obj.cover);
    }
  }

  public get full(): string {
    return `${this.author.full} - ${this.name}`;
  }

  public get hash(): string {
    return `${this.author.first}${this.author.last}${this.name}${this.paragraphs.length}`;
  }
}

export type Genre = string;

export function filterTextParagraphs(paragraphs: string[]): string[] {
  return paragraphs.filter((item) => isTextParagraph(item));
}

export function isTextParagraph(paragraph: string): boolean {
  return !paragraph.startsWith('{');
}
