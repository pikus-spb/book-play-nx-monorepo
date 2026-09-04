import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '@book-play/models';
import {
  BookPersistenceStorageService,
  BooksApiService,
  CursorPositionService,
  DomHelperService,
  Fb2FileReaderService,
  LoadingService,
} from '@book-play/services';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActiveBookService {
  private booksApiService = inject(BooksApiService);
  private fb2FileReaderService = inject(Fb2FileReaderService);
  private bookPersistenceStorageService = inject(BookPersistenceStorageService);
  private cursorPositionService = inject(CursorPositionService);
  private router = inject(Router);
  private loading = inject(LoadingService);
  private domHelperService = inject(DomHelperService);

  private _book = signal<Book | null>(null);
  readonly book = this._book.asReadonly();

  loadById(id: string): Observable<Book> {
    const current = this._book();
    if (current?.id && current.id == id) {
      return of(current);
    }

    return this.loading.track(
      this.booksApiService.loadBookById(id).pipe(
        tap((book) => this.setActiveBook(book, { persist: true }))
      )
    );
  }

  async loadFromStorage(): Promise<Book> {
    const current = this._book();
    if (current) {
      return current;
    }

    const data = await this.bookPersistenceStorageService.get();
    if (data && data.content.length > 0) {
      const book = new Book(JSON.parse(data.content));
      // Already coming from storage via the player route — do not re-persist
      // or navigate (that caused an infinite navigation loop / tab crash).
      this.setActiveBook(book, { persist: false });
      return book;
    }

    throw new Error('Error while import book from persistence storage');
  }

  async importFromFile(file: File): Promise<void> {
    const book = await this.fb2FileReaderService.parseFb2File(file);
    this.setActiveBook(book, { persist: true });
    await this.router.navigateByUrl('/player');
  }

  private setActiveBook(
    book: Book,
    options: { persist: boolean }
  ): void {
    this._book.set(book);
    if (options.persist) {
      this.bookPersistenceStorageService.set(JSON.stringify(book));
    }
    this.cursorPositionService.setCursorName(book.hash);
    setTimeout(() => this.domHelperService.showActiveParagraph());
  }
}
