import { Injectable } from '@angular/core';
import {
  DEFAULT_TITLE_CONTEXT,
  DEFAULT_TITLE_PREFIX,
} from '@book-play/constants';

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
