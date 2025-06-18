import { Errors, Settings } from '@book-play/models';
import { getSettings } from '../../utils/settings';

export interface SettingsState {
  settings: Settings;
  errors: Errors;
}

export const initialState: SettingsState = {
  settings: { ...getSettings() },
  errors: [],
};
