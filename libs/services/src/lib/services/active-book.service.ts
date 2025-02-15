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
      let book = this.book();

      let id;
      if (this.paramMapSignal) {
        id = this.paramMapSignal()?.get('id');
      }

      if (id) {
        this.eventStatesService.add(AppEventNames.loading);
        this.eventStatesService.add(AppEventNames.contentLoading);

        const bookData = await this.booksApi.getById(id);
        book = this.fb2Parser.parseBookFromString(bookData.content);
        this.update(book || null);

        this.eventStatesService.remove(AppEventNames.contentLoading);
        this.eventStatesService.remove(AppEventNames.loading);
      } else {
        if (book) {
          this.domHelper.showActiveParagraph();
          this.indexedDbStorageService.set(JSON.stringify(this.book()));
        } else {
          const data = await this.indexedDbStorageService.get();
          if (data && data.content.length > 0) {
            book = new Book(JSON.parse(data.content));
            this.update(book || null);
          }
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
