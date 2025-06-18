import { createReducer, on } from '@ngrx/store';
import { settingsUpdateAction } from './settings.actions';
import { initialState } from './settings.state';

export const settingsReducers = createReducer(
  initialState,

  on(settingsUpdateAction, (state, { settings }) => ({
    ...state,
    settings,
  }))
);
