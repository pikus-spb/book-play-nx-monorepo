import { TtsParams } from '@book-play/models';
import { Log } from '@book-play/utils-common';
import {
  getRandomFileNames,
  pitch,
  rate,
  removeSilence,
  runProcess,
  throwIfAborted,
} from '@book-play/utils-node';
import { Blob } from 'buffer';
import fs from 'fs';

export default class EdgeTtsApp {
  private normalizeText(text: string): string {
    return text.replace(/([^.]+)\.$/, '$1');
  }

  @Log()
  public async runTts(params: TtsParams, signal?: AbortSignal): Promise<Blob> {
    const { text, voice } = params;
    const files = getRandomFileNames(4, '.mp3');

    try {
      throwIfAborted(signal);

      const args = [];
      args.push(`--text="${this.normalizeText(text)}"`);
      args.push(`--voice=${voice}`);
      args.push(`--write-media=${files[0]}`);

      await runProcess('edge-tts', args, { signal });
      await removeSilence(files[0], files[1], { signal });
      await pitch(params.pitch, '24000', files[1], files[2], { signal });
      await rate(params.rate, files[2], files[3], { signal });

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
