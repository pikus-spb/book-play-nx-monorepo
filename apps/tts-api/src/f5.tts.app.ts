import { TtsParams } from '@book-play/models';
import { Log } from '@book-play/utils-common';
import {
  appendSilence,
  getRandomFileNames,
  pitch,
  rate,
  removeSilence,
  throwIfAborted,
} from '@book-play/utils-node';
import { Blob } from 'buffer';
import fs from 'fs';

export default class F5TtsApp {
  @Log()
  public async runTts(params: TtsParams, signal?: AbortSignal): Promise<Blob> {
    let { text } = params;
    const files = getRandomFileNames(5, '.mp3');

    try {
      throwIfAborted(signal);

      text = text.padEnd(20, '.');

      const response = await fetch(
        `http://127.0.0.1:4123/speech/${encodeURIComponent(text)}`,
        { signal }
      );
      const result = Buffer.from(await response.arrayBuffer());

      throwIfAborted(signal);
      fs.writeFileSync(files[0], result);

      await appendSilence(files[0], files[1], 0.7, {
        signal,
      });
      await pitch(params.pitch ?? '0', '24000', files[1], files[2], { signal });
      await rate(params.rate ?? '0', files[2], files[3], { signal });
      await removeSilence(files[3], files[4], { signal });

      throwIfAborted(signal);
      const buffer = fs.readFileSync(files[4]);

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
