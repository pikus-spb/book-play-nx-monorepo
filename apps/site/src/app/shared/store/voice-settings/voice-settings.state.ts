import { Errors, VoiceSettings } from '@book-play/models';
import { getVoiceSettings } from '../../utils/voice-settings';

export interface VoiceSettingsState {
  settings: VoiceSettings;
  errors: Errors;
}

export const initialState: VoiceSettingsState = {
  settings: { ...getVoiceSettings() },
  errors: [],
};
