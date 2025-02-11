import { Injectable } from '@angular/core';

import { Author, BookData } from '@book-play/models';

declare let stringStripHtml: any;

@Injectable({
  providedIn: 'root',
})
export class Fb2ParsingService {
  public getAuthorName(xml: XMLDocument): Author {
    const authorFirstName =
      xml.documentElement?.querySelector('author first-name')?.innerHTML;
    const authorMiddleName =
      xml?.documentElement?.querySelector('author middle-name')?.innerHTML;
    const authorLastName =
      xml?.documentElement?.querySelector('author last-name')?.innerHTML;

    return {
      first: authorFirstName,
      middle: authorMiddleName,
      last: authorLastName,
    } as Author;
  }

  public getBookTitle(xml: XMLDocument): string | undefined {
    return xml.documentElement?.querySelector('book-title')?.innerHTML;
  }

  public getBookTitlePicture(xml: XMLDocument): string | null {
    const imageElement = xml?.documentElement?.querySelector('coverpage image');
    if (imageElement != null) {
      const srcAttribute = Array.from(imageElement.attributes)
        .find((attr) => {
          return Boolean(attr.localName.match('href'));
        })
        ?.value.substr(1);

      if (srcAttribute != null) {
        const binary = xml.getElementById(srcAttribute);
        const imageType = binary?.getAttribute('content-type');
        return `data:${imageType};base64,${binary?.innerHTML}`;
      }
    }
    return null;
  }

  public getParagraphs(xml: XMLDocument, removeTags = false): string[] {
    return Array.from(xml.documentElement?.querySelectorAll('body p'))
      .map((item: Element) => {
        return removeTags
          ? stringStripHtml.stripHtml(item.innerHTML).result
          : item.innerHTML;
      })
      .filter((item) => item.trim().length > 0);
  }

  public parseBookFromString(text: string): BookData {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml') as XMLDocument;

    const author = this.getAuthorName(xml);
    const bookTitle = this.getBookTitle(xml);
    const bookTitlePicture = this.getBookTitlePicture(xml);
    const paragraphs = this.getParagraphs(xml, true);

    return {
      author,
      bookTitle,
      bookTitlePicture,
      paragraphs,
    } as BookData;
  }
}
