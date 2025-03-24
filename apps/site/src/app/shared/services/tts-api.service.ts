import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AUDIO_API_URL, HTTP_RETRY_NUMBER } from '@book-play/constants';
import { TTSParams } from '@book-play/models';
import { createQueryString } from '@book-play/utils-common';

import { Observable, retry, shareReplay, Subscription } from 'rxjs';

const AUDIO_HEADERS = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
});

@Injectable({
  providedIn: 'root',
})
export class TtsApiService {
  // http requests subscription list, is needed for an ability to cancel not needed http requests
  private subscriptions: Record<string, Subscription> = {};

  constructor(private http: HttpClient) {}

  public textToSpeech(text: string): Observable<Blob> {
    text = encodeURIComponent(text);

    // TODO: support on UI
    const pitch = Number(localStorage.getItem('pitch') || '-1');
    const rate = Number(localStorage.getItem('rate') || '1');
    const voice = localStorage.getItem('voice') || 'male';

    const options: TTSParams = { text, pitch, rate, voice };
    const postParams = createQueryString(options);
    const request$ = this.http
      .post(AUDIO_API_URL, postParams, {
        headers: AUDIO_HEADERS,
        responseType: 'blob',
      })
      .pipe(retry(HTTP_RETRY_NUMBER), shareReplay(1));

    this.subscriptions[text] = request$.subscribe();

    return request$;
  }

  public cancelAllVoiceRequests(): void {
    Object.values(this.subscriptions).forEach((sub: Subscription) =>
      sub.unsubscribe()
    );
    this.subscriptions = {};
  }
}
