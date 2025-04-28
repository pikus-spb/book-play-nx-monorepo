import { createReducer, on } from '@ngrx/store';
import { voiceSettingsUpdateAction } from './voice-settings.actions';
import { initialState } from './voice-settings.state';

export const voiceSettingsReducers = createReducer(
  initialState,

  on(voiceSettingsUpdateAction, (state, { settings }) => ({
    ...state,
    settings,
  }))
);
