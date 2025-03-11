import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Book } from '@book-play/models';
import { CursorPositionLocalStorageService } from './cursor-position-local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ActiveBookService {
  public book: WritableSignal<Book | null> = signal(null);

  private cursorService = inject(CursorPositionLocalStorageService);

  public cursorPositionIsValid(): boolean {
    const book = this.book();
    if (book !== null) {
      return this.cursorService.position < book.textParagraphs.length;
    }
    return false;
  }

  public update(book: Book | null): void {
    this.book.set(book);

    if (book !== null) {
      this.cursorService.setCursorName(book.hash);
    }
  }
}
