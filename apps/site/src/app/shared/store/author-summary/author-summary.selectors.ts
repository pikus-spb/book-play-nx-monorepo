import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { AuthorSummaryState } from './author-summary.state';

export const selectFeature = (state: AppState) => state.authorSummary;

export const authorSummarySelector = createSelector(
  selectFeature,
  (state: AuthorSummaryState) => state.author
);
