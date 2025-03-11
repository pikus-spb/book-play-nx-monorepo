import { filterTextParagraphs } from '@book-play/utils-browser';

export class ImageBase64Data {
  public imageType!: string;
  public base64Content!: string;

  constructor(obj: Partial<ImageBase64Data>) {
    Object.assign(this, obj, {});
  }

  public toBase64String(): string {
    return `data:${this.imageType};base64,${this.base64Content}`;
  }

  public static fromBase64String(str: string): ImageBase64Data | undefined {
    const matches = str.match(/data:(.+);base64,([\s\S]+)/);
    if (matches && matches.length === 3) {
      const data = {
        imageType: matches[1],
        base64Content: matches[2],
      };
      return new ImageBase64Data(data);
    }

    return undefined;
  }
}

export type DBAuthor = [string, string];

export class Author {
  public firstName!: string;
  public middleName?: string;
  public lastName!: string;

  constructor(obj: Partial<Author>) {
    Object.assign(this, obj, {});
  }

  public get fullName(): string {
    return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${
      this.lastName
    }`;
  }
}

export interface DBBook {
  id: string;
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

  public get fullName(): string {
    return `${this.author.fullName} - ${this.name}`;
  }

  public get hash(): string {
    return `${this.author.firstName}${this.author.middleName}${this.author.lastName}${this.name}${this.paragraphs.length}`;
  }
}
