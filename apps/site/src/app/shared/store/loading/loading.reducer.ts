import { createReducer, on } from '@ngrx/store';
import { LoadingState } from './loading-state';
import { loadingEndAction, loadingStartAction } from './loading.action';

export const initialState: LoadingState = false;

export const loadingReducer = createReducer(
  initialState,
  on(loadingStartAction, () => true),
  on(loadingEndAction, () => false)
);
