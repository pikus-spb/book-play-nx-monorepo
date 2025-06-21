import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Base64Data } from '@book-play/models';
import { blobToBase64 } from '@book-play/utils-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import {
  catchError,
  map,
  mergeMap,
  of,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { TtsApiService } from '../../services/tts/tts-api.service';
import {
  VoiceAudioActions,
  voiceAudioLoadFailureAction,
  voiceAudioLoadSuccessAction,
  voiceCacheUpdateAction,
} from './voice-audio.actions';
import { voiceAudioSelector } from './voice-audio.selectors';

@Injectable({
  providedIn: 'root',
})
export class VoiceAudioEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private ttsApiService = inject(TtsApiService);

  voiceAudioCacheUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VoiceAudioActions.VoiceAudioCacheUpdate),
      switchMap(({ text, record }) => {
        return of(voiceAudioLoadSuccessAction({ text, data: record.data }));
      })
    );
  });

  ttsSpeechLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VoiceAudioActions.VoiceAudioLoad),
      withLatestFrom(this.store.select(voiceAudioSelector)),
      mergeMap(([{ text }, cache]) => {
        if (cache.has(text)) {
          return of(
            voiceAudioLoadSuccessAction({ text, data: cache.get(text)!.data })
          );
        }

        const timestamp = Date.now();
        return this.ttsApiService.textToSpeech(text).pipe(
          switchMap((data: Blob) => {
            return blobToBase64(data);
          }),
          map((data: Base64Data) => {
            return voiceCacheUpdateAction({
              text,
              record: { timestamp, data },
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              voiceAudioLoadFailureAction({ errors: [errorResponse.message] })
            );
          }),
          takeUntil(this.actions$.pipe(ofType(ROUTER_REQUEST)))
        );
      })
    );
  });
}
