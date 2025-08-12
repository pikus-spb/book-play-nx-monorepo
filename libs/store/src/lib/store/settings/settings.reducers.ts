import { createReducer, on } from '@ngrx/store';
import { settingsUpdateAction } from './settings.actions';
import { initialSettingsState } from './settings.state';

export const settingsReducers = createReducer(
  initialSettingsState,

  on(settingsUpdateAction, (state, { settings }) => ({
    ...state,
    settings,
  }))
);
