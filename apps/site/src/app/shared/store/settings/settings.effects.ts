import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { storeSettings } from '../../utils/settings';
import { voiceCacheResetAction } from '../voice-audio/voice-audio.actions';
import { SettingsActions } from './settings.actions';

@Injectable({
  providedIn: 'root',
})
export class SettingsEffects {
  private actions$ = inject(Actions);

  settingsUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.SettingsUpdate),
      switchMap(({ settings }) => {
        storeSettings(settings);
        return of(voiceCacheResetAction());
      })
    );
  });
}
