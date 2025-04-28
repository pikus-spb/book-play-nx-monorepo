import { Author, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum AllAuthorsActions {
  LoadAllAuthors = '[AllAuthors] Load all authors',
  LoadAllAuthorsSuccess = '[AllAuthors] Load all authors success',
  LoadAllAuthorsFailure = '[AllAuthors] Load all authors failure',
}

export const loadAllAuthorsAction = createAction(
  AllAuthorsActions.LoadAllAuthors
);
export const loadAllAuthorsSuccessAction = createAction(
  AllAuthorsActions.LoadAllAuthorsSuccess,
  props<{ authors: Author[] }>()
);
export const loadAllAuthorsFailureAction = createAction(
  AllAuthorsActions.LoadAllAuthorsFailure,
  props<{ errors: Errors }>()
);
