import { Base64Data, VoiceSettings } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum TtsActions {
  TTSLoadSpeech = '[TTS] Load speech',
  TTSLoadSpeechSuccess = '[TTS] Load success',
  TTSLoadSpeechFailure = '[TTS] Load failure',
  TTsVoiceSettingsUpdate = '[TTS] Voice settings update',
}

// Voice settings
export const ttsVoiceSettingsUpdateAction = createAction(
  TtsActions.TTsVoiceSettingsUpdate,
  props<{ voice: VoiceSettings }>()
);

// Speech API
export const ttsLoadSpeechAction = createAction(
  TtsActions.TTSLoadSpeech,
  props<{ text: string }>()
);
export const ttsLoadSpeechSuccessAction = createAction(
  TtsActions.TTSLoadSpeechSuccess,
  props<{ text: string; data: Base64Data }>()
);
export const ttsLoadSpeechFailureAction = createAction(
  TtsActions.TTSLoadSpeechFailure,
  props<{ errors: string[] }>()
);
