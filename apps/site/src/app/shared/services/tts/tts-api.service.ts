import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  TTS_API_PORT,
  TTS_API_PORT_SECURE,
  TTS_REQUEST_CACHE_LIVE_TIME,
} from '@book-play/constants';
import { TtsParams } from '@book-play/models';
import { getCurrentProtocolUrl } from '@book-play/utils-browser';
import { createQueryString } from '@book-play/utils-common';
import { environment } from 'environments/environment';
import { first, Observable, shareReplay, tap } from 'rxjs';
import { getSettings } from '../../utils/settings';

const AUDIO_HEADERS = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
});

@Injectable({
  providedIn: 'root',
})
export class TtsApiService {
  private http = inject(HttpClient);
  private requestCache = new Map<string, Observable<Blob>>();

  public textToSpeech(text: string): Observable<Blob> {
    if (this.requestCache.has(text)) {
      return this.requestCache.get(text) as Observable<Blob>;
    }

    const url =
      getCurrentProtocolUrl(
        environment.API_HOST,
        TTS_API_PORT,
        TTS_API_PORT_SECURE
      ) + '/tts';

    const safeText = encodeURIComponent(text);
    const { pitch, rate, voice } = getSettings();
    const options: TtsParams = { text: safeText, pitch, rate, voice };
    const postParams = createQueryString(options);

    const request = this.http
      .post(url, postParams, {
        headers: AUDIO_HEADERS,
        responseType: 'blob',
      })
      .pipe(
        tap(() =>
          setTimeout(() => {
            this.requestCache.delete(text);
          }, TTS_REQUEST_CACHE_LIVE_TIME)
        ),
        first(),
        shareReplay(1)
      );
    this.requestCache.set(text, request);
    return request;
  }
}
