import {
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ParamMap } from '@angular/router';
import { Book } from '@book-play/models';
import { Fb2Parser } from '@book-play/utils';

import { BooksApiService } from './books-api.service';
import { CursorPositionLocalStorageService } from './cursor-position-local-storage.service';
import { DomHelperService } from './dom-helper.service';
import { AppEventNames, EventsStateService } from './events-state.service';
import { IndexedDbBookStorageService } from './indexed-db-book-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ActiveBookService {
  public book: WritableSignal<Book | null> = signal(null);

  private cursorService = inject(CursorPositionLocalStorageService);
  private indexedDbStorageService = inject(IndexedDbBookStorageService);
  private eventStatesService = inject(EventsStateService);
  private domHelper = inject(DomHelperService);
  private booksApi = inject(BooksApiService);
  private fb2Parser = new Fb2Parser();
  private paramMapSignal?: Signal<ParamMap | undefined>;

  constructor() {
    effect(async () => {
      if (this.paramMapSignal) {
        const id = this.paramMapSignal()?.get('id');
        let bookData;

        if (id) {
          this.eventStatesService.add(AppEventNames.loading);
          this.eventStatesService.add(AppEventNames.contentLoading);

          const book = await this.booksApi.getById(id);
          bookData = this.fb2Parser.parseBookFromString(book.content);
          this.update(bookData || null);

          this.eventStatesService.remove(AppEventNames.contentLoading);
          this.eventStatesService.remove(AppEventNames.loading);
        } else {
          const data = await this.indexedDbStorageService.get();
          if (data && data.content.length > 0) {
            bookData = JSON.parse(data.content);
            this.update(bookData || null);
          }
        }

        if (bookData) {
          this.domHelper.showActiveParagraph();
          this.indexedDbStorageService.set(JSON.stringify(this.book()));
        }
      }
    });
  }

  public cursorPositionIsValid(): boolean {
    const book = this.book();
    if (book !== null) {
      return this.cursorService.position < book.paragraphs.length;
    }
    return false;
  }

  public setRouteSignal(signal: Signal<ParamMap | undefined>): void {
    this.paramMapSignal = signal;
  }

  public update(book: Book | null): void {
    this.book.set(book);

    if (book !== null) {
      this.cursorService.setCursorName(book.hash);
    }
  }
}
