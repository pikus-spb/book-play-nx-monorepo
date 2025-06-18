import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { SettingsState } from './settings.state';

export const selectFeature = (state: AppState) => state.settings;

export const settingsSelector = createSelector(
  selectFeature,
  (state: SettingsState) => state.settings
);
