import { Injectable } from '@angular/core';

import { BookData } from '../model/fb2-book.types';
import { XmlQueryService } from './xml-query.service';

@Injectable({
  providedIn: 'root',
})
export class TextParserService {
  constructor(private xmlHelper: XmlQueryService) {}

  public parse(text: string): BookData {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml') as XMLDocument;

    const author = this.xmlHelper.getAuthorName(xml);
    const bookTitle = this.xmlHelper.getBookTitle(xml);
    const bookTitlePicture = this.xmlHelper.getBookTitlePicture(xml);
    const paragraphs = this.xmlHelper.getParagraphs(xml, true);

    return {
      author,
      bookTitle,
      bookTitlePicture,
      paragraphs,
    } as BookData;
  }
}
