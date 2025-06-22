import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import { cleanUpCache } from './voice-audio-helpers';
import {
  voiceAudioLoadFailureAction,
  voiceAudioLoadSuccessAction,
  voiceCacheResetAction,
  voiceCacheUpdateAction,
} from './voice-audio.actions';
import { initialState } from './voice-audio.state';

export const voiceAudioReducers = createReducer(
  initialState,

  on(voiceCacheResetAction, (state) => {
    const cache = state.cache;
    cache.clear();
    return {
      ...state,
      cache,
    };
  }),

  on(voiceCacheUpdateAction, (state, action) => {
    const cache = cleanUpCache(state.cache);
    cache.set(action.text, action.record);
    return {
      ...state,
      cache,
    };
  }),

  on(voiceAudioLoadSuccessAction, (state) => {
    return {
      ...state,
      errors: [],
    };
  }),

  on(voiceAudioLoadFailureAction, (state, action) => ({
    ...state,
    errors: action.errors,
  })),

  on(routerNavigationAction, () => ({ ...initialState }))
);
