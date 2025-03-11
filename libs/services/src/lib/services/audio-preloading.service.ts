import { effect, Injectable } from '@angular/core';
import { blobToBase64 } from '@book-play/utils-browser';
import { first, firstValueFrom, Observable, switchMap, tap } from 'rxjs';

import { ActiveBookService } from './active-book.service';
import { AudioStorageService } from './audio-storage.service';
import { TtsApiService } from './tts-api.service';

export const PRELOAD_EXTRA = Object.freeze({
  min: 0,
  forInitialization: 1,
  default: 10,
});

@Injectable({
  providedIn: 'root',
})
export class AudioPreloadingService {
  private _initialized = false;

  public get initialized(): boolean {
    return this._initialized;
  }
  constructor(
    private openedBook: ActiveBookService,
    private audioStorage: AudioStorageService,
    private speechService: TtsApiService
  ) {
    effect(() => {
      if (this.openedBook.book()) {
        this._initialized = false;
      }
    });
  }

  private paragraphToSpeech(index: number): Observable<string> {
    return this.speechService
      .textToSpeech(this.openedBook.book()?.textParagraphs[index] ?? '')
      .pipe(
        switchMap((blob: Blob) => {
          return blobToBase64(blob);
        }),
        tap((base64audio: string) => {
          this.audioStorage.set(index, base64audio);
        }),
        first()
      );
  }

  public async preloadParagraph(
    startIndex: number,
    extra: number = PRELOAD_EXTRA.default
  ): Promise<void> {
    const data = this.openedBook.book()?.textParagraphs;
    const dataIsValid = data && data.length > 0 && startIndex >= 0;

    if (dataIsValid) {
      const endIndex = startIndex + extra;

      for (let i = startIndex; i <= endIndex && i < data.length; i++) {
        const savedAudio = this.audioStorage.get(i);
        if (!savedAudio) {
          await firstValueFrom(this.paragraphToSpeech(i));
          if (i - startIndex >= PRELOAD_EXTRA.forInitialization) {
            this._initialized = true;
          }
        }
      }
    }
  }
}
