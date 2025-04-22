import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { TtsState } from './tts.state';

export const selectFeature = (state: AppState) => state.tts;

export const voiceSettingsSelector = createSelector(
  selectFeature,
  (state: TtsState) => state.voice
);

export const loadingSelector = createSelector(
  selectFeature,
  (state: TtsState) => state.loading
);
