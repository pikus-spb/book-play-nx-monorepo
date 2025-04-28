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
  loadRandomAuthorsActionFailure,
  loadRandomAuthorsActionSuccess,
  RandomAuthorsActions,
} from './random-authors.actions';

@Injectable({
  providedIn: 'root',
})
export class RandomAuthorsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private booksApiService = inject(BooksApiService);

  loadRandomAuthors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RandomAuthorsActions.LoadRandomAuthors),
      switchMap(() => {
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.loadRandomAuthors().pipe(
          tap(() => this.store.dispatch(loadingEndAction())),
          map((authors: Author[]) => {
            return loadRandomAuthorsActionSuccess({ authors });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loadRandomAuthorsActionFailure({ errors: [errorResponse.error] })
            );
          })
        );
      })
    );
  });
}
