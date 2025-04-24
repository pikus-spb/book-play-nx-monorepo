import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, firstValueFrom, Observable } from 'rxjs';

import { AudioCacheHelperService } from '../../store/audio-cache/audio-cache-helper.service';
import { audioCacheRecordSelector } from '../../store/audio-cache/audio-cache.selectors';
import { activeBookSelector } from '../../store/books-cache/active-book.selectors';
import { ttsLoadSpeechAction } from '../../store/tts/tts.actions';

export const PRELOAD_EXTRA = Object.freeze({
  min: 0,
  default: 10,
});

@Injectable({
  providedIn: 'root',
})
export class AudioPreloadingService {
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private audioCacheHelperService = inject(AudioCacheHelperService);

  private paragraphToSpeech(index: number): Observable<string> {
    const text = this.activeBook()!.textParagraphs[index];

    this.store.dispatch(ttsLoadSpeechAction({ text }));

    return this.store.pipe(
      select(audioCacheRecordSelector, { text }),
      filter((value) => {
        return Boolean(value);
      })
    );
  }

  public async preloadParagraph(
    startIndex: number,
    extra: number = PRELOAD_EXTRA.default
  ): Promise<void> {
    const textParagraphs = this.activeBook()?.textParagraphs;
    const dataIsValid =
      textParagraphs &&
      textParagraphs.length > 0 &&
      startIndex >= 0 &&
      startIndex < textParagraphs.length;

    if (dataIsValid) {
      const endIndex =
        startIndex + extra < textParagraphs?.length
          ? startIndex + extra
          : textParagraphs?.length - 1;

      for (let i = startIndex; i <= endIndex; i++) {
        const savedAudio = await this.audioCacheHelperService.getAudioPromise(
          i
        );
        if (!savedAudio) {
          await firstValueFrom(this.paragraphToSpeech(i));
        }
      }
    }
  }
}
