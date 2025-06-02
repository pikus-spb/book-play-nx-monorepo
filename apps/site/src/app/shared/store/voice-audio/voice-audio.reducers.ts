import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  voiceAudioLoadFailureAction,
  voiceAudioLoadSuccessAction,
  voiceCacheResetAction,
  voiceCacheUpdateAction,
} from './voice-audio.actions';
import { initialState } from './voice-audio.state';

export const voiceAudioReducers = createReducer(
  initialState,

  on(voiceCacheResetAction, (state) => ({
    ...state,
    cache: {},
  })),

  on(voiceCacheUpdateAction, (state, action) => {
    return {
      ...state,
      cache: {
        ...state.cache,
        [action.text]: action.data,
      },
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
