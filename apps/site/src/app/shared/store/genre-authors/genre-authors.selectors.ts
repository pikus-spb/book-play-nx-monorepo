import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { GenreAuthorsState } from './genre-authors.state';

export const selectFeature = (state: AppState) => state.genreAuthors;

export const genreAuthorsSelector = createSelector(
  selectFeature,
  (state: GenreAuthorsState) => state.authors
);
