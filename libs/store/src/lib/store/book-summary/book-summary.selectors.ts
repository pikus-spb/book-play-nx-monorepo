import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { BookSummaryState } from './book-summary.state';

export const selectBookSummaryFeature = (state: AppState) => state.bookSummary;

export const bookSummarySelector = createSelector(
  selectBookSummaryFeature,
  (state: BookSummaryState) => state.summary
);
