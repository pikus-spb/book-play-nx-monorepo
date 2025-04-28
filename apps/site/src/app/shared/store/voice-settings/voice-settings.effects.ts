import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { storeVoiceSettings } from '../../utils/voice-settings';
import { voiceCacheResetAction } from '../voice-audio/voice-audio.actions';
import { VoiceSettingsActions } from './voice-settings.actions';

@Injectable({
  providedIn: 'root',
})
export class VoiceSettingsEffects {
  private actions$ = inject(Actions);

  voiceSettingsUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VoiceSettingsActions.VoiceSettingsUpdate),
      switchMap(({ settings }) => {
        storeVoiceSettings(settings);
        return of(voiceCacheResetAction());
      })
    );
  });
}
