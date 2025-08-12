import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { LoadingState } from './loading.state';

export const selectLoadingFeature = (state: AppState) => state.loading;

export const selectLoading = createSelector(
  selectLoadingFeature,
  (state: LoadingState) => state
);
