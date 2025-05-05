import {
  YANDEX_TTS_API_DEFAULT_OPTIONS,
  YANDEX_TTS_API_URL,
} from '@book-play/constants';
import { TtsParams } from '@book-play/models';
import { createQueryString } from '@book-play/utils-common';

export default class YandexTtsApp {
  public async runTts(params: TtsParams): Promise<Blob> {
    const postParams = {
      ...YANDEX_TTS_API_DEFAULT_OPTIONS,
      speed: this.normalizeSpeed(params.rate),
      speaker: params.voice,
      text: encodeURIComponent(params.text),
    };

    return await fetch(YANDEX_TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createQueryString(postParams),
    }).then((response) => response.blob());
  }

  private normalizeSpeed(speed: string): number {
    return Number(speed) * 0.02 + 1;
  }
}
