import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '@book-play/models';
import { BooksApiService } from '@book-play/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, takeUntil, tap } from 'rxjs';
import {
  loadingEndAction,
  loadingStartAction,
} from '../loading/loading.action';
import {
  BookSummaryActions,
  loadBookSummaryFailureAction,
  loadBookSummarySuccessAction,
  resetBookSummaryAction,
} from './book-summary.actions';

@Injectable({
  providedIn: 'root',
})
export class BookSummaryEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private booksApiService = inject(BooksApiService);

  loadBookSummary$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BookSummaryActions.LoadBookSummary),
      switchMap(({ bookId }) => {
        this.store.dispatch(resetBookSummaryAction());
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.loadBookSummaryById(bookId).pipe(
          takeUntil(this.actions$.pipe(ofType(ROUTER_REQUEST))),
          tap(() => this.store.dispatch(loadingEndAction())),
          map((summary: Book) => {
            return loadBookSummarySuccessAction({ summary });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loadBookSummaryFailureAction({
                errors: [errorResponse.error],
              })
            );
          })
        );
      })
    );
  });
}
