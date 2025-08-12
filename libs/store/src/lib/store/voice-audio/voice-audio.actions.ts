import { Base64Data } from '@book-play/models';
import { createAction, props } from '@ngrx/store';
import { AudioCacheRecord } from './voice-audio.state';

export enum VoiceAudioActions {
  VoiceAudioCacheReset = '[VoiceAudio] cache reset',
  VoiceAudioCacheUpdate = '[VoiceAudio] cache updated',
  VoiceAudioLoad = '[VoiceAudio] Load speech',
  VoiceAudioLoadSuccess = '[VoiceAudio] Load success',
  VoiceAudioLoadFailure = '[VoiceAudio] Load failure',
}

export const voiceCacheResetAction = createAction(
  VoiceAudioActions.VoiceAudioCacheReset
);
export const voiceCacheUpdateAction = createAction(
  VoiceAudioActions.VoiceAudioCacheUpdate,
  props<{ text: string; record: AudioCacheRecord }>()
);
export const voiceAudioLoadAction = createAction(
  VoiceAudioActions.VoiceAudioLoad,
  props<{ text: string }>()
);
export const voiceAudioLoadSuccessAction = createAction(
  VoiceAudioActions.VoiceAudioLoadSuccess,
  props<{ text: string; data: Base64Data }>()
);
export const voiceAudioLoadFailureAction = createAction(
  VoiceAudioActions.VoiceAudioLoadFailure,
  props<{ errors: string[] }>()
);
