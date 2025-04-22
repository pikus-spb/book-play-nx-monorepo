import { createReducer, on } from '@ngrx/store';
import {
  ttsLoadSpeechAction,
  ttsLoadSpeechFailureAction,
  ttsLoadSpeechSuccessAction,
  ttsVoiceSettingsUpdateAction,
} from './tts.actions';
import { initialState } from './tts.state';

export const ttsReducers = createReducer(
  initialState,

  on(ttsLoadSpeechAction, (state) => ({
    ...state,
    loading: true,
  })),

  on(ttsLoadSpeechSuccessAction, (state) => {
    return {
      ...state,
      loading: false,
      errors: [],
    };
  }),

  on(ttsLoadSpeechFailureAction, (state, action) => ({
    ...state,
    loading: false,
    errors: action.errors,
  })),

  on(ttsVoiceSettingsUpdateAction, (state, { voice }) => ({
    ...state,
    voice,
  }))
);
