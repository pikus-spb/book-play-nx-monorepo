import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { BookSearchState } from './book-search.state';

export const selectBookSearchFeature = (state: AppState) => state.bookSearch;

export const bookSearchSelector = createSelector(
  selectBookSearchFeature,
  (state: BookSearchState) => state.books
);

export const bookSearchErrorsSelector = createSelector(
  selectBookSearchFeature,
  (state: BookSearchState) => state.errors
);
