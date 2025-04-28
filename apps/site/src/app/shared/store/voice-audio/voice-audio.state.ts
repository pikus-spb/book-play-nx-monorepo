import { Base64Data, Errors } from '@book-play/models';

export type AudioCache = Record<string, Base64Data>;

export interface VoiceAudioState {
  cache: AudioCache;
  errors: Errors;
}

export const initialState: VoiceAudioState = {
  cache: {},
  errors: [],
};
