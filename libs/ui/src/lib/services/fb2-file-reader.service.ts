import { Injectable } from '@angular/core';
import { Book } from '@book-play/models';
import { Fb2Parser } from '@book-play/utils-common';

@Injectable({
  providedIn: 'root',
})
export class Fb2FileReaderService {
  private fb2Parser = new Fb2Parser();

  private detectFileEncoding(
    file: Blob,
    defaultEncoding = 'UTF-8'
  ): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = (fileEvent: Event) => {
        const content = (fileEvent.target as FileReader).result as string;
        let detectedEncoding = content?.match(/encoding="([^"]+)"/)?.[1];
        if (detectedEncoding == null) {
          detectedEncoding = defaultEncoding;
        }
        resolve(detectedEncoding);
      };
      reader.readAsBinaryString(file);
    });
  }

  public async readBlobFromFile(file: Blob): Promise<string> {
    return this.detectFileEncoding(file).then((encoding: string) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = (fileEvent: Event) => {
          const text = (fileEvent.target as FileReader).result as string;
          resolve(text);
        };
        reader.readAsText(file, encoding);
      });
    });
  }

  public async parseFb2File(file: File): Promise<Book> {
    const text = await this.readBlobFromFile(file);
    return this.fb2Parser.parseBookFromLoaded(
      this.fb2Parser.loadCheeroApi(text)
    );
  }
}
