import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { RandomBooks } from './random-books';

export const selectFeature = (state: AppState) => state.randomBooks;

export const randomBooksSelector = createSelector(
  selectFeature,
  (state: RandomBooks) => state.books
);
