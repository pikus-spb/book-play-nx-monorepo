import { inject, Injectable } from '@angular/core';
import { VOICE_CACHE_PRELOAD_EXTRA } from '@book-play/constants';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { CursorPositionService } from '../../services/player/cursor-position.service';
import { activeBookSelector } from '../active-book/active-book.selectors';
import { voiceAudioRecordSelector } from './voice-audio.selectors';
import { AudioCache } from './voice-audio.state';

@Injectable({
  providedIn: 'root',
})
export class VoiceAudioHelperService {
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private cursorService = inject(CursorPositionService);

  public getAudio(idx?: number): Promise<string> {
    if (this.activeBook() !== null) {
      return firstValueFrom(
        this.store.select(voiceAudioRecordSelector, {
          text: this.activeBook()!.textParagraphs[
            idx ?? this.cursorService.position
          ],
        })
      );
    }
    return Promise.resolve('');
  }
}

export function cleanUpCache(cache: AudioCache): AudioCache {
  const overLimitCount = cache.size - VOICE_CACHE_PRELOAD_EXTRA.max;

  if (overLimitCount > 0) {
    const cacheKeyToDelete = Array.from(cache.keys())
      .sort((a, b) => {
        return cache.get(a)!.timestamp - cache.get(b)!.timestamp;
      })
      .slice(0, overLimitCount);

    cacheKeyToDelete.forEach((key) => cache.delete(key));
  }

  return cache;
}
