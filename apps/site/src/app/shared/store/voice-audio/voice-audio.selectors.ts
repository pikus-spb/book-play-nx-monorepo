import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { VoiceAudioState } from './voice-audio.state';

export const selectFeature = (state: AppState) => state.voiceAudio;

export const voiceAudioRecordSelector = createSelector(
  selectFeature,
  (state: VoiceAudioState, props: { text: string }) => {
    return state.cache[props.text];
  }
);

export const voiceAudioSelector = createSelector(
  selectFeature,
  (state: VoiceAudioState) => state.cache
);
