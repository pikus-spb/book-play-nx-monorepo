import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenreAuthor } from '@book-play/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { BooksApiService } from '../../services/books/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../loading/loading.action';
import {
  GenreAuthorsActions,
  loadGenreAuthorsFailureAction,
  loadGenreAuthorsSuccessAction,
} from './genre-authors.actions';

@Injectable({
  providedIn: 'root',
})
export class GenreAuthorsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private booksApiService = inject(BooksApiService);

  loadGenreAuthors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GenreAuthorsActions.LoadGenreAuthors),
      switchMap(({ genre }) => {
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.loadAuthorsByGenre(genre).pipe(
          tap(() => this.store.dispatch(loadingEndAction())),
          map((authors: GenreAuthor[]) => {
            return loadGenreAuthorsSuccessAction({ authors });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loadGenreAuthorsFailureAction({ errors: [errorResponse.error] })
            );
          })
        );
      })
    );
  });
}
