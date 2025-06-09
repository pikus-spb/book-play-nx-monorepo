import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { RandomAuthorSummaryState } from './random-author-summary.state';

export const selectFeature = (state: AppState) => state.randomAuthors;

export const randomAuthorsSelector = createSelector(
  selectFeature,
  (state: RandomAuthorSummaryState) => state.authors
);
