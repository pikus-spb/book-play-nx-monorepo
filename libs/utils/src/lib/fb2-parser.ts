import { LOGO_MAX_LENGTH } from '@book-play/constants';
import { Author, Book, ImageBase64Data } from '@book-play/models';
import { cleanHTML, cleanHTMLAndCopyrights } from './cleanup-tools';

export class Fb2Parser {
  public getAuthor(xml: XMLDocument): Author {
    let firstName =
      xml.documentElement?.querySelector('author first-name')?.innerHTML;
    let middleName =
      xml?.documentElement?.querySelector('author middle-name')?.innerHTML;
    let lastName =
      xml?.documentElement?.querySelector('author last-name')?.innerHTML;

    if (firstName) {
      firstName = cleanHTML(firstName);
    }
    if (middleName) {
      middleName = cleanHTML(middleName);
    }
    if (lastName) {
      lastName = cleanHTML(lastName);
    }

    return {
      firstName,
      middleName,
      lastName,
    } as Author;
  }

  public getBookName(xml: XMLDocument): string | null {
    const name = xml.documentElement?.querySelector('book-title')?.innerHTML;
    if (name) {
      return cleanHTML(name);
    }

    return null;
  }

  private getCoverPicture(xml: XMLDocument): ImageBase64Data | null {
    const imageElement = xml?.documentElement?.querySelector('coverpage image');
    if (imageElement != null) {
      const srcAttribute = Array.from(imageElement.attributes)
        .find((attr) => {
          return Boolean(attr.localName.match('href'));
        })
        ?.value.substring(1);

      if (srcAttribute != null) {
        const binary = xml.getElementById(srcAttribute);
        if (binary && binary.innerHTML.length <= LOGO_MAX_LENGTH) {
          const imageType = binary.getAttribute('content-type');
          return {
            imageType,
            base64Content: binary.innerHTML,
          } as ImageBase64Data;
        }
      }
    }

    return null;
  }

  public getParagraphs(xml: XMLDocument): string[] {
    return Array.from(xml.documentElement?.querySelectorAll('body p'))
      .map((item: Element) => {
        return cleanHTMLAndCopyrights(item.innerHTML);
      })
      .filter((item) => item.trim().length > 0);
  }

  public parseBookFromString(text: string): Book {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml') as XMLDocument;

    const author = this.getAuthor(xml);
    const name = this.getBookName(xml);

    const cover = this.getCoverPicture(xml);
    const paragraphs = this.getParagraphs(xml);

    return { author, name, cover, paragraphs } as Book;
  }
}
