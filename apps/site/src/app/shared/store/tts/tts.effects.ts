import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Base64Data } from '@book-play/models';
import { blobToBase64 } from '@book-play/utils-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TtsApiService } from '../../services/tts/tts-api.service';
import { storeVoiceSettings } from '../../utils/voice-settings';
import {
  ttsVoiceCacheResetAction,
  ttsVoiceCacheUpdateAction,
} from '../audio-cache/audio-cache.actions';
import { audioCacheSelector } from '../audio-cache/audio-cache.selectors';
import {
  TtsActions,
  ttsLoadSpeechFailureAction,
  ttsLoadSpeechSuccessAction,
} from './tts.actions';

@Injectable({
  providedIn: 'root',
})
export class TtsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private ttsApiService = inject(TtsApiService);

  updateVoiceSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TtsActions.TTsVoiceSettingsUpdate),
      switchMap(({ voice }) => {
        storeVoiceSettings(voice);
        return of(ttsVoiceCacheResetAction());
      })
    );
  });

  ttsSpeechLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TtsActions.TTSLoadSpeech),
      withLatestFrom(this.store.select(audioCacheSelector)),
      switchMap(([{ text }, cache]) => {
        if (cache[text]) {
          return of(ttsLoadSpeechSuccessAction({ text, data: cache[text] }));
        }
        return this.ttsApiService.textToSpeech(text).pipe(
          switchMap((data: Blob) => {
            return blobToBase64(data);
          }),
          map((data: Base64Data) => {
            return ttsVoiceCacheUpdateAction({ text, data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              ttsLoadSpeechFailureAction({ errors: [errorResponse.error] })
            );
          })
        );
      })
    );
  });
}
