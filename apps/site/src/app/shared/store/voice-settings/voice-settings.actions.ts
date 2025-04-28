import { VoiceSettings } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum VoiceSettingsActions {
  VoiceSettingsUpdate = '[VoiceSettings] settings update',
}
export const voiceSettingsUpdateAction = createAction(
  VoiceSettingsActions.VoiceSettingsUpdate,
  props<{ settings: VoiceSettings }>()
);
