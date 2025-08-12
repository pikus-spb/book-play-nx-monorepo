import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { VoiceAudioState } from './voice-audio.state';

export const selectVoiceAudioFeature = (state: AppState) => state.voiceAudio;

export const voiceAudioRecordSelector = createSelector(
  selectVoiceAudioFeature,
  (state: VoiceAudioState, props: { text: string }) => {
    const record = state.cache.get(props.text);
    return record ? record.data : '';
  }
);

export const voiceAudioSelector = createSelector(
  selectVoiceAudioFeature,
  (state: VoiceAudioState) => state.cache
);
