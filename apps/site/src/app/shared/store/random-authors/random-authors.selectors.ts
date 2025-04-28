import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { RandomAuthorsState } from './random-authors.state';

export const selectFeature = (state: AppState) => state.randomAuthors;

export const randomAuthorsSelector = createSelector(
  selectFeature,
  (state: RandomAuthorsState) => state.authors
);
