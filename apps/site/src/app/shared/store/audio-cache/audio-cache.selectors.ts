import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { AudioCacheState } from './audio-cache.state';

export const selectFeature = (state: AppState) => state.audioCache;

export const audioCacheRecordSelector = createSelector(
  selectFeature,
  (state: AudioCacheState, props: { text: string }) => {
    return state[props.text];
  }
);

export const audioCacheSelector = createSelector(
  selectFeature,
  (state: AudioCacheState) => state
);
