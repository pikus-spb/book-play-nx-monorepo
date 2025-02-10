import { Injectable, signal, WritableSignal } from '@angular/core';
import { CursorPositionLocalStorageService } from 'app/modules/player/services/cursor-position-local-storage.service';
import { BookData } from 'app/shared/model/fb2-book.types';
import { BookStringsService } from 'app/shared/services/book-strings.service';

@Injectable({
  providedIn: 'root',
})
export class ActiveBookService {
  public book: WritableSignal<BookData | null> = signal(null);

  constructor(
    private cursorService: CursorPositionLocalStorageService,
    private bookUtils: BookStringsService
  ) {}

  update(value: BookData | null): void {
    this.book.set(value);

    if (value !== null) {
      this.cursorService.setCursorName(this.bookUtils.getBookHashKey(value));
    }
  }
}
