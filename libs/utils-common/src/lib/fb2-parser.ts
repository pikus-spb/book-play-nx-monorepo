import { MAX_IMAGE_DATA_LENGTH } from '@book-play/constants';
import { Author, Book, ImageBase64Data } from '@book-play/models';
import { CheerioAPI, load } from 'cheerio';
import {
  cleanHTMLAndCopyrights,
  cleanNonRussianWords,
  cleanSpaces,
  findRussianIndex,
  isTextInRussian,
} from './cleanup-tools';

export function parseFb2Image(
  imageElement: HTMLElement,
  $: CheerioAPI
): ImageBase64Data | undefined {
  const attrs = imageElement.attributes;
  const attr = Array.from(attrs).find(
    (attr) => attr.name.indexOf('href') !== -1
  )!;

  // @ts-expect-error: imageElement type
  const src = $(imageElement).attr(attr.name)!.substring(1);

  if (src !== undefined) {
    const binary = $([...$('binary')].find((el) => $(el).attr('id') === src));
    if (binary && binary.text().length <= MAX_IMAGE_DATA_LENGTH) {
      const imageType = binary.attr('content-type');
      return new ImageBase64Data({
        imageType,
        base64Content: binary.text(),
      });
    }
  }

  return undefined;
}

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
        middleName: isTextInRussian(middle[index])
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
    $('coverpage').remove();

    if (imageElement.get(0)) {
      // @ts-expect-error: imageElement types
      return parseFb2Image(imageElement.get(0), $);
    }

    return undefined;
  }

  public getAnnotation($: CheerioAPI): string {
    return ($('annotation').toArray() || [])
      .map((item) => {
        return cleanHTMLAndCopyrights($(item).text());
      })
      .filter((item) => item.length > 0)
      .join(' ');
  }
  public getParagraphs($: CheerioAPI): string[] {
    $('history').remove();
    $('annotation').remove();

    return $('body p, poem, img')
      .toArray()
      .map((item) => {
        if (item.tagName === 'img') {
          return JSON.stringify(
            parseFb2Image(item as unknown as HTMLElement, $)
          );
        }
        return cleanHTMLAndCopyrights($(item).text());
      })
      .filter((item) => item.length > 0);
  }

  public getGenres($: CheerioAPI): string[] {
    const genres = $('genre')
      .toArray()
      .map((item) => {
        return $(item).text() || '';
      })
      .filter((item) => item.length > 0);

    return [...new Set(genres)];
  }

  public getDate($: CheerioAPI): string {
    return (
      $('date')
        .toArray()
        .map((item) => {
          return $(item)
            .text()
            .match(/(\d{4})/)?.[1]; // get year only
        })
        .filter(Boolean)[0] ?? ''
    );
  }

  public load(text: string): CheerioAPI {
    return load(text);
  }

  public parseLanguage($: CheerioAPI): string {
    const langElement = $('lang');

    let result = '';
    if (langElement.length > 0) {
      result = $(langElement[0]).text();
    }

    return result;
  }

  public parseBookFromLoaded($: CheerioAPI): Book {
    const cover = this.getCoverPicture($);
    const author = this.getAuthor($);
    const name = this.getBookName($);
    const annotation = this.getAnnotation($);
    const genres = this.getGenres($);
    const date = this.getDate($);
    const paragraphs = this.getParagraphs($);

    return new Book({
      author,
      name,
      annotation,
      genres,
      date,
      cover,
      paragraphs,
    });
  }
}
