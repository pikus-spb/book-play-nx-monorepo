import { Book, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum AuthorBooksActions {
  LoadAuthorBooks = '[AuthorBooks] Load author books',
  LoadAuthorBooksSuccess = '[AuthorBooks] Load author books success',
  LoadAuthorBooksFailure = '[AuthorBooks] Load author books failure',
}

export const loadAuthorBooksAction = createAction(
  AuthorBooksActions.LoadAuthorBooks,
  props<{ authorId: number }>()
);
export const loadAuthorBooksSuccessAction = createAction(
  AuthorBooksActions.LoadAuthorBooksSuccess,
  props<{ books: Book[] }>()
);
export const loadAuthorBooksFailureAction = createAction(
  AuthorBooksActions.LoadAuthorBooksFailure,
  props<{ errors: Errors }>()
);
