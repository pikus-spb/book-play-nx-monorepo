import { inject, Injectable } from '@angular/core';
import { VOICE_CACHE_PRELOAD_EXTRA } from '@book-play/constants';
import { select, Store } from '@ngrx/store';
import { filter, firstValueFrom, Observable, of } from 'rxjs';
import { activeBookSelector } from '../../store/active-book/active-book.selectors';

import { VoiceAudioHelperService } from '../../store/voice-audio/voice-audio-helpers';
import { voiceAudioLoadAction } from '../../store/voice-audio/voice-audio.actions';
import { voiceAudioRecordSelector } from '../../store/voice-audio/voice-audio.selectors';

@Injectable({
  providedIn: 'root',
})
export class AudioPreloadingService {
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private audioCacheHelperService = inject(VoiceAudioHelperService);

  private loadParagraphVoiceAudio(index: number): Observable<string> {
    if (this.activeBook() !== null) {
      const text = this.activeBook()!.textParagraphs[index];

      this.store.dispatch(voiceAudioLoadAction({ text }));

      return this.store.pipe(
        select(voiceAudioRecordSelector, { text }),
        filter((value) => {
          return Boolean(value);
        })
      );
    }
    return of('');
  }

  public async preloadParagraph(
    startIndex: number,
    extra: number = VOICE_CACHE_PRELOAD_EXTRA.default
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
        const savedAudio = await this.audioCacheHelperService.getAudio(i);
        if (!savedAudio) {
          await firstValueFrom(this.loadParagraphVoiceAudio(i));
        }
      }
    }
  }
}
