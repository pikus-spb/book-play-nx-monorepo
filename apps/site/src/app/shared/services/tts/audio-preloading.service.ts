import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, firstValueFrom, Observable } from 'rxjs';

import { AudioCacheHelperService } from '../../store/audio-cache/audio-cache-helper.service';
import { audioCacheRecordSelector } from '../../store/audio-cache/audio-cache.selectors';
import { ttsLoadSpeechAction } from '../../store/tts/tts.actions';
import { ActiveBookService } from '../books/active-book.service';

export const PRELOAD_EXTRA = Object.freeze({
  min: 0,
  default: 10,
});

@Injectable({
  providedIn: 'root',
})
export class AudioPreloadingService {
  private openedBook = inject(ActiveBookService);
  private store = inject(Store);
  private audioCacheHelperService = inject(AudioCacheHelperService);

  private paragraphToSpeech(index: number): Observable<string> {
    const text = this.openedBook.book()!.textParagraphs[index];

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
    const textParagraphs = this.openedBook.book()?.textParagraphs;
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
