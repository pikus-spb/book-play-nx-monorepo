import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TTS_API_PORT, TTS_API_PORT_SECURE } from '@book-play/constants';
import { TtsParams } from '@book-play/models';
import { getCurrentProtocolUrl } from '@book-play/utils-browser';
import { createQueryString } from '@book-play/utils-common';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { getSettings } from '../../utils/settings';

@Injectable({
  providedIn: 'root',
})
export class TtsApiService {
  private http = inject(HttpClient);
  private url =
    getCurrentProtocolUrl(
      environment.API_HOST,
      TTS_API_PORT,
      TTS_API_PORT_SECURE
    ) + '/tts';

  public textToSpeech(text: string): Observable<Blob> {
    const safeText = encodeURIComponent(text);
    const { pitch, rate, voice } = getSettings();
    const options: TtsParams = { text: safeText, pitch, rate, voice };
    const postParams = createQueryString(options);

    return this.http.post(this.url, postParams, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      responseType: 'blob',
    });
  }
}
