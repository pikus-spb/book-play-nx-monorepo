import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '@book-play/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { BooksApiService } from '../../services/books/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../loading/loading.action';
import {
  BookSummaryActions,
  loadBookSummaryFailureAction,
  loadBookSummarySuccessAction,
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
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.loadBookSummaryById(bookId).pipe(
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
