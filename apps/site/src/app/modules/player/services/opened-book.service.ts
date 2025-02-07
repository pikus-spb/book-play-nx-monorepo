import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { CursorPositionStoreService } from 'app/modules/player/services/cursor-position-store.service';
import { BookData } from 'app/shared/model/fb2-book.types';
import { BookUtilsService } from 'app/shared/services/book-utils.service';
import { IndexedDbBookManagerService } from './indexed-db-book-manager.service';
import { IndexedDbStorageService } from './indexed-db-storage.service';

@Injectable({
  providedIn: 'root',
})
export class OpenedBookService {
  private indexedDBBookManager: IndexedDbBookManagerService;

  public book: WritableSignal<BookData | null> = signal(null);

  constructor(
    private cursorService: CursorPositionStoreService,
    private bookUtils: BookUtilsService
  ) {
    this.indexedDBBookManager = new IndexedDbBookManagerService(
      inject(IndexedDbStorageService),
      inject(Router),
      this
    );
    this.indexedDBBookManager.watchOpenedBook();
  }

  update(value: BookData | null): void {
    this.book.set(value);

    if (value !== null) {
      this.cursorService.setCursorName(this.bookUtils.getBookHashKey(value));
    }
  }
}
