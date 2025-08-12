import { inject, Injectable } from '@angular/core';
import { Settings } from '@book-play/models';
import { getSettings, storeSettings } from '@book-play/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, of, switchMap, tap } from 'rxjs';
import { voiceCacheResetAction } from '../voice-audio/voice-audio.actions';
import { SettingsActions } from './settings.actions';

@Injectable({
  providedIn: 'root',
})
export class SettingsEffects {
  private actions$ = inject(Actions);

  settingsUpdate$ = createEffect(() => {
    let oldSettings: Settings;
    return this.actions$.pipe(
      ofType(SettingsActions.SettingsUpdate),
      tap(({ settings }) => {
        oldSettings = getSettings();
        storeSettings(settings);
      }),
      filter(({ settings }) => {
        // Exclude timer changes
        return (
          `${settings.voice}${settings.rate}${settings.pitch}` !==
          `${oldSettings.voice}${oldSettings.rate}${oldSettings.pitch}`
        );
      }),
      switchMap(() => {
        return of(voiceCacheResetAction());
      })
    );
  });
}
