import { inject, Injectable } from '@angular/core';
import { VOICE_CACHE_PRELOAD_EXTRA } from '@book-play/constants';
import { DomAudioHelperService } from '@book-play/services';
import { ActiveBookService } from './active-book.service';
import { VoiceAudioService } from './voice-audio.service';

@Injectable({
  providedIn: 'root',
})
export class AudioPreloadingService {
  private activeBook = inject(ActiveBookService).book;
  private voiceAudio = inject(VoiceAudioService);
  private audioPlayer = inject(DomAudioHelperService);

  private abortControllers: AbortController[] = [];

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
        const controller = new AbortController();
        this.abortControllers.push(controller);
        // Always load the current paragraph first, even if it might be cached
        // This ensures we have valid audio data before checking stop status
        await this.voiceAudio.load(text, controller.signal);
        
        // If already cached from previous load, skip subsequent processing
        if (this.voiceAudio.getCached(text)) {
          // Break loop if the player was stopped during preloading
          if (this.audioPlayer.stopped) {
            this.cancelRequests();
            break;
          }
        }
      }
    }
  }

  private cancelRequests(): void {
    this.abortControllers.forEach((c) => c.abort());
    this.abortControllers = [];
  }
}
