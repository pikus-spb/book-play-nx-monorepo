import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { LoadingState } from './loading-state';

export const selectFeature = (state: AppState) => state.loading;

export const selectLoading = createSelector(
  selectFeature,
  (state: LoadingState) => state
);
