import { Book, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum RandomBooksActions {
  LoadRandomBooks = '[RandomBooks] Load random books',
  LoadRandomBooksSuccess = '[RandomBooks] Load random books success',
  LoadRandomBooksFailure = '[RandomBooks] Load random books failure',
}

export const loadRandomBooksAction = createAction(
  RandomBooksActions.LoadRandomBooks
);
export const loadRandomBooksSuccessAction = createAction(
  RandomBooksActions.LoadRandomBooksSuccess,
  props<{ books: Book[] }>()
);
export const loadRandomBooksFailureAction = createAction(
  RandomBooksActions.LoadRandomBooksFailure,
  props<{ errors: Errors }>()
);
