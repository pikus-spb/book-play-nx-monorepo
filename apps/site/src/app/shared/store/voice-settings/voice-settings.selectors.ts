import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { VoiceSettingsState } from './voice-settings.state';

export const selectFeature = (state: AppState) => state.voiceSettings;

export const voiceSettingsSelector = createSelector(
  selectFeature,
  (state: VoiceSettingsState) => state.settings
);
