import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { AuthorSummaryState } from './author-summary.state';

export const selectAuthorSummaryFeature = (state: AppState) =>
  state.authorSummary;

export const authorSummarySelector = createSelector(
  selectAuthorSummaryFeature,
  (state: AuthorSummaryState) => state.author
);
