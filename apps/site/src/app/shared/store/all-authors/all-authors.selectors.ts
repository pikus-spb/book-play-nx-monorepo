import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { AllAuthorsState } from './all-authors.state';

export const selectFeature = (state: AppState) => state.allAuthors;

export const allAuthorsSelector = createSelector(
  selectFeature,
  (state: AllAuthorsState) => state.authors
);
