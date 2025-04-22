import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { ttsLoadSpeechSuccessAction } from '../tts/tts.actions';
import { AudioCacheActions } from './audio-cache.actions';

@Injectable({
  providedIn: 'root',
})
export class AudioCacheEffects {
  private actions$ = inject(Actions);

  audioCacheUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AudioCacheActions.TTSCacheUpdate),
      switchMap(({ text, data }) => {
        return of(ttsLoadSpeechSuccessAction({ text, data }));
      })
    );
  });
}
