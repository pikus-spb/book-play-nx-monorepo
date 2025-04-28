import { inject, Injectable } from '@angular/core';
import { Book } from '@book-play/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { BooksApiService } from '../../services/books/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../loading/loading.action';
import {
  loadRandomBooksFailureAction,
  loadRandomBooksSuccessAction,
  RandomBooksActions,
} from './random-books.actions';

@Injectable({
  providedIn: 'root',
})
export class RandomBooksEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private booksApiService = inject(BooksApiService);

  loadRandomBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RandomBooksActions.LoadRandomBooks),
      switchMap(() => {
        this.store.dispatch(loadingStartAction());
        return this.booksApiService.loadRandomBookIds();
      }),
      switchMap((ids: string[]) => {
        return forkJoin<Book[]>(
          ids.map((id: string) => this.booksApiService.loadBookSummaryById(id))
        );
      }),
      tap(() => {
        this.store.dispatch(loadingEndAction());
      }),
      map((books: Book[]) => {
        return loadRandomBooksSuccessAction({ books });
      }),
      catchError((error) => {
        return of(loadRandomBooksFailureAction({ errors: [error] }));
      })
    );
  });
}
