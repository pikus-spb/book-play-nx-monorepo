import { createReducer, on } from '@ngrx/store';
import {
  ttsVoiceCacheResetAction,
  ttsVoiceCacheUpdateAction,
} from './audio-cache.actions';
import { initialState } from './audio-cache.state';

export const audioCacheReducers = createReducer(
  initialState,

  on(ttsVoiceCacheResetAction, () => ({})),

  on(ttsVoiceCacheUpdateAction, (state, action) => {
    return {
      ...state,
      [action.text]: action.data,
    };
  })
);
