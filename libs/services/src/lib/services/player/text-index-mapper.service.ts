import { Injectable } from '@angular/core';
import { isTextParagraph } from '@book-play/models';

@Injectable({
  providedIn: 'root',
})
export class TextIndexMapperService {
  private textIndexes: Record<number, number> = {};

  public setParagraphs(paragraphs: string[]) {
    let textIndex = 0;
    this.textIndexes = {};

    paragraphs.forEach((p, index) => {
      this.textIndexes[index] = textIndex;

      if (isTextParagraph(p)) {
        textIndex++;
      }
    });
  }

  public getTextIndex(index: number): number {
    return this.textIndexes[index];
  }
}
