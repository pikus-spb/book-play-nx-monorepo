import { Injectable } from '@angular/core';
import { stripHtml } from 'string-strip-html';

import { Author } from '../model/fb2-book.types';

@Injectable({
  providedIn: 'root',
})
export class XmlQueryService {
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
        return removeTags ? stripHtml(item.innerHTML).result : item.innerHTML;
      })
      .filter((item) => item.trim().length > 0);
  }
}
