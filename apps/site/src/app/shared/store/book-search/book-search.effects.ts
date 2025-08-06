import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BookData } from '@book-play/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { BooksApiService } from '../../services/books/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../loading/loading.action';
import {
  BookSearchActions,
  bookSearchFailureAction,
  bookSearchSuccessAction,
} from './book-search.actions';

@Injectable({
  providedIn: 'root',
})
export class BookSearchEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private booksApiService = inject(BooksApiService);

  bookSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BookSearchActions.BookSearch),
      switchMap(({ query }) => {
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.bookSearch(query).pipe(
          takeUntil(this.actions$.pipe(ofType(ROUTER_REQUEST))),
          tap(() => this.store.dispatch(loadingEndAction())),
          map((books: BookData[]) => {
            return bookSearchSuccessAction({ books });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.store.dispatch(loadingEndAction());
            return of(
              bookSearchFailureAction({ errors: [errorResponse.message] })
            );
          })
        );
      })
    );
  });
}
