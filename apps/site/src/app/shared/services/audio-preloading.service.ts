import { inject, Injectable } from '@angular/core';
import { VOICE_CACHE_PRELOAD_EXTRA } from '@book-play/constants';
import { ActiveBookService } from './active-book.service';
import { VoiceAudioService } from './voice-audio.service';

@Injectable({
  providedIn: 'root',
})
export class AudioPreloadingService {
  private activeBook = inject(ActiveBookService).book;
  private voiceAudio = inject(VoiceAudioService);

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
        startIndex + extra < textParagraphs.length
          ? startIndex + extra
          : textParagraphs.length - 1;

      for (let i = startIndex; i <= endIndex; i++) {
        const text = textParagraphs[i];
        if (!this.voiceAudio.getCached(text)) {
          await this.voiceAudio.load(text);
        }
      }
    }
  }
}
