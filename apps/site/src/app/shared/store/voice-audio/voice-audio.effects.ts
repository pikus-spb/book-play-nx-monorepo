import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Base64Data } from '@book-play/models';
import { blobToBase64 } from '@book-play/utils-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
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
      switchMap(({ text, data }) => {
        return of(voiceAudioLoadSuccessAction({ text, data }));
      })
    );
  });

  ttsSpeechLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VoiceAudioActions.VoiceAudioLoad),
      withLatestFrom(this.store.select(voiceAudioSelector)),
      mergeMap(([{ text }, cache]) => {
        if (cache[text]) {
          return of(voiceAudioLoadSuccessAction({ text, data: cache[text] }));
        }
        return this.ttsApiService.textToSpeech(text).pipe(
          switchMap((data: Blob) => {
            return blobToBase64(data);
          }),
          map((data: Base64Data) => {
            return voiceCacheUpdateAction({ text, data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              voiceAudioLoadFailureAction({ errors: [errorResponse.error] })
            );
          })
        );
      })
    );
  });
}
