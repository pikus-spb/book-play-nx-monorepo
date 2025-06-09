import { Author, AuthorSummary, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum RandomAuthorSummaryActions {
  LoadRandomAuthors = '[RandomAuthors] Load authors',
  LoadRandomAuthorsActionSuccess = '[RandomAuthors] Load authors success',
  LoadRandomAuthorsActionFailure = '[RandomAuthors] Load authors failure',
}

export const loadRandomAuthorsAction = createAction(
  RandomAuthorSummaryActions.LoadRandomAuthors
);
export const loadRandomAuthorsActionSuccess = createAction(
  RandomAuthorSummaryActions.LoadRandomAuthorsActionSuccess,
  props<{ authors: AuthorSummary[] }>()
);
export const loadRandomAuthorsActionFailure = createAction(
  RandomAuthorSummaryActions.LoadRandomAuthorsActionFailure,
  props<{ errors: Errors }>()
);
