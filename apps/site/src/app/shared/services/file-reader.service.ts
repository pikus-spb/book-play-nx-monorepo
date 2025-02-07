import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  private detectEncoding(
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

  public async readFile(file: Blob): Promise<string> {
    return this.detectEncoding(file).then((encoding: string) => {
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
}
