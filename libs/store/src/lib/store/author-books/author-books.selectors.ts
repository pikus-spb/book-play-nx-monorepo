import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { AuthorBooksState } from './author-books.state';

export const selectAuthorBooksFeature = (state: AppState) => state.authorBooks;

export const authorBooksSelector = createSelector(
  selectAuthorBooksFeature,
  (state: AuthorBooksState) => state.authorBooks
);
