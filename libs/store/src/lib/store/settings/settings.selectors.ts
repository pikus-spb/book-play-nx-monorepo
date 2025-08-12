import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { SettingsState } from './settings.state';

export const selectSettingsFeature = (state: AppState) => state.settings;

export const settingsSelector = createSelector(
  selectSettingsFeature,
  (state: SettingsState) => state.settings
);
