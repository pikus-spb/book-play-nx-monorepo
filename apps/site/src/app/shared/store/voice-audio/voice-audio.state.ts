import { Base64Data, Errors } from '@book-play/models';

export interface AudioCacheRecord {
  data: Base64Data;
  timestamp: number;
}

export type AudioCache = Map<string, AudioCacheRecord>;

export interface VoiceAudioState {
  cache: AudioCache;
  errors: Errors;
}

export const initialState: VoiceAudioState = Object.freeze({
  cache: new Map() as AudioCache,
  errors: [],
});
