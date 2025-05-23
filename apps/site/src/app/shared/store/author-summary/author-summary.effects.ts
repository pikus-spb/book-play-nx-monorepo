import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthorSummary } from '@book-play/models';
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
  AuthorSummaryActions,
  loadAuthorSummaryFailureAction,
  loadAuthorSummarySuccessAction,
} from './author-summary.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthorSummaryEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private booksApiService = inject(BooksApiService);

  loadAuthorSummary$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthorSummaryActions.LoadAuthorSummary),
      switchMap(({ authorId }) => {
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.loadAuthorSummary(authorId).pipe(
          takeUntil(this.actions$.pipe(ofType(ROUTER_REQUEST))),
          tap(() => this.store.dispatch(loadingEndAction())),
          map((summary: AuthorSummary) => {
            return loadAuthorSummarySuccessAction({ summary });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loadAuthorSummaryFailureAction({ errors: [errorResponse.error] })
            );
          })
        );
      })
    );
  });
}
