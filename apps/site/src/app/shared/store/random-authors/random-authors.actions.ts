import { Author, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum RandomAuthorsActions {
  LoadRandomAuthors = '[RandomAuthors] Load authors',
  LoadRandomAuthorsActionSuccess = '[RandomAuthors] Load authors success',
  LoadRandomAuthorsActionFailure = '[RandomAuthors] Load authors failure',
}

export const loadRandomAuthorsAction = createAction(
  RandomAuthorsActions.LoadRandomAuthors
);
export const loadRandomAuthorsActionSuccess = createAction(
  RandomAuthorsActions.LoadRandomAuthorsActionSuccess,
  props<{ authors: Author[] }>()
);
export const loadRandomAuthorsActionFailure = createAction(
  RandomAuthorsActions.LoadRandomAuthorsActionFailure,
  props<{ errors: Errors }>()
);
