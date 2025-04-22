import { Errors, VoiceSettings } from '@book-play/models';
import { getVoiceSettings } from '../../utils/voice-settings';

export interface TtsState {
  loading: boolean;
  voice: VoiceSettings;
  errors: Errors;
}

export const initialState: TtsState = {
  loading: false,
  voice: { ...getVoiceSettings() },
  errors: [],
};
