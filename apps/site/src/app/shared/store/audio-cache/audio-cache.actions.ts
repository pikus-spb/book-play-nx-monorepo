import { Base64Data } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum AudioCacheActions {
  TTSCacheReset = '[AudioCache] cache reset',
  TTSCacheUpdate = '[AudioCache] cache updated',
}

export const ttsVoiceCacheResetAction = createAction(
  AudioCacheActions.TTSCacheReset
);
export const ttsVoiceCacheUpdateAction = createAction(
  AudioCacheActions.TTSCacheUpdate,
  props<{ text: string; data: Base64Data }>()
);
