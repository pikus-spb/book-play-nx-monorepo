import {
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { BooksApiService } from 'app/modules/library/services/books-api.service';
import { CursorPositionLocalStorageService } from 'app/modules/player/services/cursor-position-local-storage.service';
import { DomHelperService } from 'app/modules/player/services/dom-helper.service';
import { IndexedDbBookStorageService } from 'app/modules/player/services/indexed-db-book-storage.service';
import { BookData } from 'app/shared/model/fb2-book.types';
import { BookStringsService } from 'app/shared/services/book-strings.service';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';
import { Fb2ParsingService } from 'app/shared/services/fb2-parsing.service';

@Injectable({
  providedIn: 'root',
})
export class ActiveBookService {
  public book: WritableSignal<BookData | null> = signal(null);

  private cursorService = inject(CursorPositionLocalStorageService);
  private bookUtils = inject(BookStringsService);
  private indexedDbStorageService = inject(IndexedDbBookStorageService);
  private eventStatesService = inject(EventsStateService);
  private domHelper = inject(DomHelperService);
  private booksApi = inject(BooksApiService);
  private fb2ParsingService = inject(Fb2ParsingService);
  private idSignal?: WritableSignal<string | null>;

  constructor() {
    effect(async () => {
      if (this.idSignal) {
        const id = this.idSignal();
        let bookData;

        if (id) {
          this.eventStatesService.add(AppEventNames.loading);
          this.eventStatesService.add(AppEventNames.contentLoading);

          const book = await this.booksApi.getById(id);
          bookData = this.fb2ParsingService.parseBookFromString(book.content);
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

  public setRouteParamSignal(idSignal: WritableSignal<string | null>): void {
    this.idSignal = idSignal;
  }

  update(value: BookData | null): void {
    this.book.set(value);

    if (value !== null) {
      this.cursorService.setCursorName(this.bookUtils.getBookHashKey(value));
    }
  }
}
