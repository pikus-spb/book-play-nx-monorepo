import { LOGO_MAX_LENGTH } from '@book-play/constants';
import { Author, Book, ImageBase64Data } from '@book-play/models';
import { CheerioAPI, load } from 'cheerio';
import {
  cleanHTMLAndCopyrights,
  cleanNonRussianWords,
  cleanSpaces,
  findRussianIndex,
  isInRussian,
} from './cleanup-tools';

export class Fb2Parser {
  public getAuthor($: CheerioAPI): Author {
    const first = $('author first-name')
      .toArray()
      .map((item) => cleanSpaces($(item).text()));
    const middle = $('author middle-name')
      .toArray()
      .map((item) => cleanSpaces($(item).text()));
    const last = $('author last-name')
      .toArray()
      .map((item) => cleanSpaces($(item).text()));

    const index = findRussianIndex(first);

    if (index !== -1) {
      return new Author({
        firstName: cleanNonRussianWords(first[index]),
        middleName: isInRussian(middle[index])
          ? cleanNonRussianWords(middle[index])
          : '',
        lastName: cleanNonRussianWords(last[index]),
      });
    }

    return new Author({});
  }

  public getBookName($: CheerioAPI): string {
    const name = $('book-title').first().text();
    return cleanSpaces(name);
  }

  private getCoverPicture($: CheerioAPI): ImageBase64Data | undefined {
    const imageElement = $('coverpage > *').first();
    if (imageElement.get(0)) {
      const attr = [...imageElement.get(0)!.attributes].find(
        (attr) => attr.name.indexOf('href') !== -1
      )!;
      const src = imageElement.attr(attr.name)!.substring(1);

      if (src !== undefined) {
        const binary = $(
          [...$('binary')].find((el) => $(el).attr('id') === src)
        );
        if (binary && binary.text().length <= LOGO_MAX_LENGTH) {
          const imageType = binary.attr('content-type');
          return new ImageBase64Data({
            imageType,
            base64Content: binary.text(),
          });
        }
      }
    }

    return undefined;
  }

  public getParagraphs($: CheerioAPI): string[] {
    $('history').remove();

    return $('body p')
      .toArray()
      .map((item) => {
        return cleanHTMLAndCopyrights($(item).text());
      })
      .filter((item) => item.length > 0);
  }

  public parseBookFromString(text: string): Book {
    const $ = load(text);

    const cover = this.getCoverPicture($);
    const author = this.getAuthor($);
    const name = this.getBookName($);
    const paragraphs = this.getParagraphs($);

    return new Book({ author, name, cover, paragraphs });
  }
}
