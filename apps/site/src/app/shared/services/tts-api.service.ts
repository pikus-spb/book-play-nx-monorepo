import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUDIO_API_URL, HTTP_RETRY_NUMBER } from '@book-play/constants';
import { TTSParams } from '@book-play/models';
import { createQueryString } from '@book-play/utils-common';

import { Observable, retry, shareReplay, Subscription } from 'rxjs';
import { SettingsService } from './settings.service';

const AUDIO_HEADERS = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
});

@Injectable({
  providedIn: 'root',
})
export class TtsApiService {
  // http requests subscription list, is needed for an ability to cancel not needed http requests
  private subscriptions: Record<string, Subscription> = {};
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  public textToSpeech(text: string): Observable<Blob> {
    text = encodeURIComponent(text);
    const { pitch, rate, voice } = this.settingsService.getVoiceSettings();
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
