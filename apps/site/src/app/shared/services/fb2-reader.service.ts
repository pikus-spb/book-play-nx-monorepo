import { Injectable } from '@angular/core';

import { BookData } from '../model/fb2-book.types';
import { FileReaderService } from './file-reader.service';
import { TextParserService } from './text-parser.service';

@Injectable({
  providedIn: 'root',
})
export class Fb2ReaderService {
  constructor(
    private fb2Parser: TextParserService,
    private fileHelper: FileReaderService
  ) {}

  public readBookFromFile(file: Blob): Promise<BookData> {
    return this.fileHelper.readFile(file).then((text: string) => {
      return this.readBookFromString(text);
    });
  }

  public readBookFromString(text: string): BookData {
    return this.fb2Parser.parse(text);
  }
}
