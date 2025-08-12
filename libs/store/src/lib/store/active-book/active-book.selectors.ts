import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { ActiveBookState } from './active-book.state';

export const selectFeature = (state: AppState) => state.activeBook;

export const activeBookSelector = createSelector(
  selectFeature,
  (state: ActiveBookState) => {
    return state.activeBook;
  }
);

export const errorsSelector = createSelector(
  selectFeature,
  (state: ActiveBookState) => state.errors
);
