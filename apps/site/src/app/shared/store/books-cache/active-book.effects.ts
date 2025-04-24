import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '@book-play/models';
import { Fb2FileReaderService, RouterHelperService } from '@book-play/ui';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  from,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import { BookPersistenceStorageService } from '../../services/books/book-persistence-storage.service';
import { BooksApiService } from '../../services/books/books-api.service';
import { CursorPositionService } from '../../services/player/cursor-position.service';
import { DomHelperService } from '../../services/player/dom-helper.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../loading/loading.action';
import {
  ActiveBookActions,
  activeBookFailureAction,
  activeBookSuccessAction,
} from './active-book.actions';
import { activeBookSelector } from './active-book.selectors';

@Injectable({
  providedIn: 'root',
})
export class ActiveBookEffects {
  private actions$ = inject(Actions);
  private booksApiService = inject(BooksApiService);
  private fb2FileReaderService = inject(Fb2FileReaderService);
  private bookPersistenceStorageService = inject(BookPersistenceStorageService);
  private cursorPositionService = inject(CursorPositionService);
  private router = inject(Router);
  private routerHelperService = inject(RouterHelperService);
  private store = inject(Store);
  private domHelperService = inject(DomHelperService);

  bookLoadByIdEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveBookActions.ActiveBookLoadById),
      withLatestFrom(this.store.select(activeBookSelector)),
      switchMap(([{ id }, activeBook]) => {
        if (!(activeBook?.id && activeBook.id == id)) {
          this.store.dispatch(loadingStartAction());
          return this.booksApiService.getBookById(id).pipe(
            map((book) => {
              return activeBookSuccessAction({ book });
            }),
            catchError((error) => {
              return of(activeBookFailureAction({ errors: [error] }));
            }),
            tap(() => {
              this.store.dispatch(loadingEndAction());
            })
          );
        } else {
          return of(activeBookSuccessAction({ book: activeBook }));
        }
      })
    );
  });

  bookImportFromFileEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveBookActions.ActiveBookImportFromFile),
      switchMap(({ file }) => {
        return from(this.fb2FileReaderService.parseFb2File(file)).pipe(
          map((book) => activeBookSuccessAction({ book })),
          catchError((error) => {
            return of(activeBookFailureAction({ errors: [String(error)] }));
          })
        );
      })
    );
  });

  bookImportFromPersistenceStorageEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveBookActions.ActiveBookImportFromPersistenceStorage),
      switchMap(() => {
        return this.bookPersistenceStorageService.get().then((data) => {
          if (data && data.content.length > 0) {
            const book = new Book(JSON.parse(data.content));
            return activeBookSuccessAction({ book });
          } else {
            return activeBookFailureAction({
              errors: ['Error while import book from persistence storage'],
            });
          }
        });
      })
    );
  });

  bookLoadSuccessEffect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ActiveBookActions.ActiveBookLoadSuccess),
        tap(({ book }) => {
          this.bookPersistenceStorageService.set(JSON.stringify(book));
          if (!this.routerHelperService.isRouteActive('player')) {
            this.router.navigateByUrl('/player');
          }
          this.cursorPositionService.setCursorName(book.hash);
          setTimeout(() => this.domHelperService.showActiveParagraph());
        })
      );
    },
    { dispatch: false }
  );
}
