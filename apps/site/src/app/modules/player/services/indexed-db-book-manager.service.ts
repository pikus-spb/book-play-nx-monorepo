import { effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  DBBookData,
  IndexedDbStorageService,
} from './indexed-db-storage.service';
import { OpenedBookService } from './opened-book.service';

export class IndexedDbBookManagerService {
  constructor(
    private indexedDbStorage: IndexedDbStorageService,
    private router: Router,
    private openedBook: OpenedBookService
  ) {
    effect(() => {
      if (this.openedBook.book()) {
        this.indexedDbStorage.set(JSON.stringify(this.openedBook.book()));
      }
    });
  }

  public watchOpenedBook() {
    this.indexedDbStorage.get().then((data: DBBookData) => {
      // TODO: fix dirty code
      const id = this.router.url.match(/player\/([0-9]+)/)?.[1];
      if (!id && data && data.content.length > 0) {
        const bookData = JSON.parse(data.content);
        this.openedBook.update(bookData);
      }
    });
  }
}
