import { AuthorSummary, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum AuthorSummaryActions {
  LoadAuthorSummary = '[AuthorSummary] Load author summary',
  LoadAuthorSummarySuccess = '[AuthorSummary] Load author summary success',
  LoadAuthorSummaryFailure = '[AuthorSummary] Load author summary failure',
}

export const loadAuthorSummaryAction = createAction(
  AuthorSummaryActions.LoadAuthorSummary,
  props<{ authorId: string }>()
);
export const loadAuthorSummarySuccessAction = createAction(
  AuthorSummaryActions.LoadAuthorSummarySuccess,
  props<{ summary: AuthorSummary }>()
);
export const loadAuthorSummaryFailureAction = createAction(
  AuthorSummaryActions.LoadAuthorSummaryFailure,
  props<{ errors: Errors }>()
);
