import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { BookSummaryState } from './book-summary.state';

export const selectFeature = (state: AppState) => state.bookSummary;

export const bookSummarySelector = createSelector(
  selectFeature,
  (state: BookSummaryState) => state.summary
);
