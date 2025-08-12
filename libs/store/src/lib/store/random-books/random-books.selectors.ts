import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { RandomBooksState } from './random-books.state';

export const selectRandomBooksFeature = (state: AppState) => state.randomBooks;

export const randomBooksSelector = createSelector(
  selectRandomBooksFeature,
  (state: RandomBooksState) => state.books
);
