import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveBookService } from './active-book.service';
import { Fb2ParsingService } from './fb2-parsing.service';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  private fb2Service = inject(Fb2ParsingService);
  private activeBookService = inject(ActiveBookService);
  private router = inject(Router);

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

  public async parseNewFile(files?: FileList): Promise<void> {
    if (files && files.length > 0) {
      const text = await this.readBlobFromFile(files[0]);
      const bookData = await this.fb2Service.parseBookFromString(text);
      this.activeBookService.update(bookData);
      this.router.navigateByUrl('/player');
    } else {
      this.activeBookService.update(null);
    }
  }
}
