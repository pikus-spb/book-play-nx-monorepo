import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { BookSearchState } from './book-search.state';

export const selectFeature = (state: AppState) => state.bookSearch;

export const bookSearchSelector = createSelector(
  selectFeature,
  (state: BookSearchState) => state.books
);

export const bookSearchErrorsSelector = createSelector(
  selectFeature,
  (state: BookSearchState) => state.errors
);
