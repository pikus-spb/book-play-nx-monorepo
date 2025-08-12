import { Settings } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum SettingsActions {
  SettingsUpdate = '[Settings] settings update',
}
export const settingsUpdateAction = createAction(
  SettingsActions.SettingsUpdate,
  props<{ settings: Settings }>()
);
