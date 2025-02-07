import { Injectable } from '@angular/core';

const DEFAULT_TITLE_PREFIX = 'Book-play.ru';
const DEFAULT_EMPTY_CONTEXT =
  'Бесплатное проигрывание книг в формате fb2 онлайн';
const DEFAULT_TITLE_CONTEXT = 'бесплатно слушать аудиокнигу онлайн';

export const DEFAULT_TITLE = `${DEFAULT_TITLE_PREFIX} - ${DEFAULT_EMPTY_CONTEXT}`;

@Injectable({
  providedIn: 'root',
})
export class DocumentTitleService {
  private setFullTitle(title: string): void {
    if (document.title !== title) {
      document.title = title;
    }
  }

  public setContextTitle(context: string): void {
    const title = [DEFAULT_TITLE_PREFIX, context, DEFAULT_TITLE_CONTEXT];
    this.setFullTitle(title.join(' - '));
  }
}
