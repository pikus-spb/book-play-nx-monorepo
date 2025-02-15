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

export class Author {
  public firstName!: string;
  public middleName?: string;
  public lastName!: string;

  constructor(obj: Partial<Author>) {
    Object.assign(this, obj, {});
  }

  public toString(): string {
    return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${
      this.lastName
    }`;
  }
}

export type DBAuthorBooks = Record<string, DBBook[]>;
export type AuthorBooks = Record<string, Book[]>;

export interface DBBook {
  id: string;
  first: string;
  middle: string;
  last: string;
  name: string;
  full: string;
  cover: string;
  paragraphs: string;
}

export class Book {
  public id?: string;
  public author!: Author;
  public name!: string;
  public cover?: ImageBase64Data;
  public paragraphs!: string[];

  constructor(obj: Partial<Book>) {
    Object.assign(this, obj, {});
    if (obj.author) {
      this.author = new Author(obj.author);
    }
    if (obj.cover) {
      this.cover = new ImageBase64Data(obj.cover);
    }
  }

  public get fullName(): string {
    return `${this.author.toString()} - ${this.name}`;
  }

  public get hash(): string {
    return `${this.author.firstName}${this.author.middleName}${this.author.lastName}${this.name}${this.paragraphs.length}`;
  }

  public get xml(): string {
    const result = [];
    result.push(`<?xml version="1.0" encoding="UTF-8"?>
                    <FictionBook xmlns:l="http://www.w3.org/1999/xlink" xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
                        <description>`);
    if (this.cover) {
      result.push(`<coverpage><image l:href="#cover"/></coverpage>`);
    }

    result.push(`<author>
                    <first-name>${this.author.firstName}</first-name>
                    <last-name>${this.author.lastName}</last-name>
                  </author>
                  <book-title>${this.name}</book-title> 
                  </description>
                  <body>
                  ${this.paragraphs
                    .map((item) => '<p>' + item + '</p>')
                    .join('')}
                  </body>`);
    if (this.cover) {
      result.push(
        `<binary content-type="${this.cover.imageType}" id="cover">${this.cover.base64Content}</binary>`
      );
    }
    result.push(`</FictionBook>`);

    return result.join('');
  }
}
