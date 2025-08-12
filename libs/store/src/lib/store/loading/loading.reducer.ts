import { createReducer, on } from '@ngrx/store';
import { loadingEndAction, loadingStartAction } from './loading.action';
import { LoadingState } from './loading.state';

export const initialState: LoadingState = false;

export const loadingReducer = createReducer(
  initialState,
  on(loadingStartAction, () => true),
  on(loadingEndAction, () => false)
);
