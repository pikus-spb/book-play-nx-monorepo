import { effect, Injectable } from '@angular/core';
import { first, firstValueFrom, Observable, switchMap, tap } from 'rxjs';
import { AudioStorageService } from 'app/modules/player/services/audio-storage.service';
import { OpenedBookService } from 'app/modules/player/services/opened-book.service';
import { TtsApiService } from 'app/modules/player/services/tts-api.service';
import { Base64HelperService } from 'app/shared/services/base64-helper.service';

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
    private openedBook: OpenedBookService,
    private audioStorage: AudioStorageService,
    private speechService: TtsApiService,
    private base64Helper: Base64HelperService
  ) {
    effect(() => {
      if (this.openedBook.book()) {
        this._initialized = false;
      }
    });
  }

  private fetchAudio(index: number): Observable<string> {
    return this.speechService
      .textToSpeech(this.openedBook.book()?.paragraphs[index] ?? '')
      .pipe(
        switchMap((blob: Blob) => {
          return this.base64Helper.blobToBase64(blob);
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
    const data = this.openedBook.book()?.paragraphs;
    const dataIsValid = data && data.length > 0 && startIndex >= 0;

    if (dataIsValid) {
      const endIndex = startIndex + extra;

      for (let i = startIndex; i <= endIndex && i < data.length; i++) {
        const savedAudio = this.audioStorage.get(i);
        if (!savedAudio) {
          await firstValueFrom(this.fetchAudio(i));
          if (i - startIndex >= PRELOAD_EXTRA.forInitialization) {
            this._initialized = true;
          }
        }
      }
    }
  }
}
