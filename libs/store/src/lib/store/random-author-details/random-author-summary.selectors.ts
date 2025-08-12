import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { RandomAuthorSummaryState } from './random-author-summary.state';

export const selectRandomAuthorFeature = (state: AppState) =>
  state.randomAuthors;

export const randomAuthorsSelector = createSelector(
  selectRandomAuthorFeature,
  (state: RandomAuthorSummaryState) => state.authors
);
