import { Book, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum BookSummaryActions {
  LoadBookSummary = '[LoadBookSummary] Load summary',
  LoadBookSummarySuccess = '[LoadBookSummary] Load summary success',
  LoadBookSummaryFailure = '[LoadBookSummary] Load summary failure',
}

export const loadBookSummaryAction = createAction(
  BookSummaryActions.LoadBookSummary,
  props<{ bookId: string }>()
);
export const loadBookSummarySuccessAction = createAction(
  BookSummaryActions.LoadBookSummarySuccess,
  props<{ summary: Book }>()
);
export const loadBookSummaryFailureAction = createAction(
  BookSummaryActions.LoadBookSummaryFailure,
  props<{ errors: Errors }>()
);
