import { TtsParams } from '@book-play/models';
import { Log } from '@book-play/utils-common';
import {
  getRandomFileNames,
  pitch,
  rate,
  removeSilence,
  throwIfAborted,
} from '@book-play/utils-node';
import { Blob } from 'buffer';
import fs from 'fs';

const VOICE_SPEED_FIX_DELTA = 4;
const TTS_LENGTH_LIMIT = 200;
const GOOGLE_TTS_URL = 'https://translate.google.com/translate_tts';
const GOOGLE_TTS_USER_AGENT =
  'GoogleTranslate/5.26.59113 (iPhone; iOS 12.1; ru; iPhone9,3)';

export default class GoogleTtsApp {
  private splitLongWord(word: string): string[] {
    const chunks = [];
    for (let i = 0; i < word.length; i += TTS_LENGTH_LIMIT) {
      chunks.push(word.slice(i, i + TTS_LENGTH_LIMIT));
    }

    return chunks;
  }

  private wrapText(text: string): string[] {
    const chunks = [''];
    const words = text.split(/\s+/);

    words.forEach((word) => {
      if (word.length > TTS_LENGTH_LIMIT) {
        chunks.push(...this.splitLongWord(word));
        return;
      }

      const nextWord = (chunks[chunks.length - 1].length ? ' ' : '') + word;
      if (chunks[chunks.length - 1].length + nextWord.length <= TTS_LENGTH_LIMIT) {
        chunks[chunks.length - 1] += nextWord;
      } else {
        chunks.push(word);
      }
    });

    return chunks.filter(Boolean);
  }

  private async getTts(text: string, signal?: AbortSignal): Promise<Buffer> {
    const buffers = [];

    for (const chunk of this.wrapText(text)) {
      throwIfAborted(signal);

      const searchParams = new URLSearchParams({
        client: 'it',
        tl: 'ru',
        q: chunk,
        ie: 'UTF-8',
      });
      const response = await fetch(`${GOOGLE_TTS_URL}?${searchParams}`, {
        headers: {
          'User-Agent': GOOGLE_TTS_USER_AGENT,
        },
        signal,
      });

      if (!response.ok) {
        throw new Error('request error: ' + response.status);
      }

      buffers.push(Buffer.from(await response.arrayBuffer()));
    }

    return Buffer.concat(buffers);
  }

  @Log()
  public async runTts(params: TtsParams, signal?: AbortSignal): Promise<Blob> {
    const { text } = params;
    const files = getRandomFileNames(4, '.mp3');

    try {
      throwIfAborted(signal);
      const result = await this.getTts(text, signal);

      fs.writeFileSync(files[0], result);

      await removeSilence(files[0], files[1], { signal });
      await pitch(params.pitch, '24000', files[1], files[2], { signal });
      await rate(
        (Number(params.rate) - VOICE_SPEED_FIX_DELTA).toString(),
        files[2],
        files[3],
        { signal }
      );

      throwIfAborted(signal);
      const buffer = fs.readFileSync(files[3]);

      return new Blob([buffer]);
    } finally {
      setTimeout(() => {
        files.forEach((file) => {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        });
      }, 100);
    }
  }
}
