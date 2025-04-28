import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { AuthorBooksState } from './author-books.state';

export const selectFeature = (state: AppState) => state.authorBooks;

export const authorBooksSelector = createSelector(
  selectFeature,
  (state: AuthorBooksState) => state.authorBooks
);
