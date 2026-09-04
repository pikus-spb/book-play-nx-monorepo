import { inject, Injectable } from '@angular/core';
import { VOICE_CACHE_PRELOAD_EXTRA } from '@book-play/constants';
import { TtsApiService } from '@book-play/services';
import { blobToBase64 } from '@book-play/utils-browser';
import { firstValueFrom, switchMap } from 'rxjs';

interface AudioCacheRecord {
  data: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class VoiceAudioService {
  private ttsApiService = inject(TtsApiService);
  private cache = new Map<string, AudioCacheRecord>();
  private inflight = new Map<string, Promise<string>>();

  getCached(text: string): string {
    return this.cache.get(text)?.data ?? '';
  }

  async load(text: string): Promise<string> {
    const cached = this.getCached(text);
    if (cached) {
      return cached;
    }

    const pending = this.inflight.get(text);
    if (pending) {
      return pending;
    }

    const request = firstValueFrom(
      this.ttsApiService.textToSpeech(text).pipe(switchMap(blobToBase64))
    )
      .then((data) => {
        this.cache.set(text, { data, timestamp: Date.now() });
        this.cleanUpCache();
        return data;
      })
      .finally(() => this.inflight.delete(text));

    this.inflight.set(text, request);
    return request;
  }

  reset(): void {
    this.cache.clear();
  }

  private cleanUpCache(): void {
    const overLimitCount = this.cache.size - VOICE_CACHE_PRELOAD_EXTRA.max;
    if (overLimitCount <= 0) {
      return;
    }

    const keysToDelete = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, overLimitCount)
      .map(([key]) => key);

    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}
