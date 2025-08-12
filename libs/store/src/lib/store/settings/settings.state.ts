import { Errors, Settings } from '@book-play/models';
import { getSettings } from '@book-play/services';

export interface SettingsState {
  settings: Settings;
  errors: Errors;
}

export const initialSettingsState: SettingsState = {
  settings: { ...getSettings() },
  errors: [],
};
