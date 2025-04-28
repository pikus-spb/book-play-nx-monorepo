import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Author } from '@book-play/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { BooksApiService } from '../../services/books/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../loading/loading.action';
import {
  AllAuthorsActions,
  loadAllAuthorsFailureAction,
  loadAllAuthorsSuccessAction,
} from './all-authors.actions';

@Injectable({
  providedIn: 'root',
})
export class AllAuthorsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private booksApiService = inject(BooksApiService);

  loadAllAuthors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AllAuthorsActions.LoadAllAuthors),
      switchMap(() => {
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.loadAllAuthors().pipe(
          tap(() => this.store.dispatch(loadingEndAction())),
          map((authors: Author[]) => {
            return loadAllAuthorsSuccessAction({ authors });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loadAllAuthorsFailureAction({ errors: [errorResponse.error] })
            );
          })
        );
      })
    );
  });
}
