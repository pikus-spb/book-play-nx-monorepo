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
  AuthorBooksActions,
  loadAuthorBooksFailureAction,
  loadAuthorBooksSuccessAction,
} from './author-books.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthorBooksEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private booksApiService = inject(BooksApiService);

  loadAuthorBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthorBooksActions.LoadAuthorBooks),
      switchMap(({ authorId }) => {
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.loadAuthorBooks(authorId).pipe(
          takeUntil(this.actions$.pipe(ofType(ROUTER_REQUEST))),
          tap(() => this.store.dispatch(loadingEndAction())),
          map((books: Book[]) => {
            return loadAuthorBooksSuccessAction({ books });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loadAuthorBooksFailureAction({ errors: [errorResponse.message] })
            );
          })
        );
      })
    );
  });
}
