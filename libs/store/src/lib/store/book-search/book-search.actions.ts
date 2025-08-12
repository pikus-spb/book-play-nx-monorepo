import { BookData, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum BookSearchActions {
  BookSearch = '[BookSearch] Fetch',
  BookSearchSuccess = '[BookSearch] Fetch success',
  BookSearchFailure = '[BookSearch] Fetch failure',
}

export const bookSearchAction = createAction(
  BookSearchActions.BookSearch,
  props<{ query: string }>()
);

export const bookSearchSuccessAction = createAction(
  BookSearchActions.BookSearchSuccess,
  props<{ books: BookData[] }>()
);

export const bookSearchFailureAction = createAction(
  BookSearchActions.BookSearchFailure,
  props<{ errors: Errors }>()
);
