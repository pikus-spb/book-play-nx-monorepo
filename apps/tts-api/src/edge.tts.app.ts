import { TtsParams } from '@book-play/models';
import { log, Log } from '@book-play/utils-common';
import {
  getRandomFileNames,
  pitch,
  rate,
  removeSilence,
} from '@book-play/utils-node';
import { Blob } from 'buffer';
import { spawn } from 'child_process';
import fs from 'fs';

export default class EdgeTtsApp {
  private normalizeText(text: string): string {
    return text.replace(/([^.]+)\.$/, '$1');
  }

  @Log()
  public runTts(params: TtsParams): Promise<Blob> {
    const { text, voice } = params;
    const files = getRandomFileNames(4, '.mp3');

    const args = [];
    args.push(`--text="${this.normalizeText(text)}"`);
    args.push(`--voice=${voice}`);
    args.push(`--write-media=${files[0]}`);

    log('edge-tts: ' + args.join(' '));

    const ttsProc = spawn('edge-tts', args, { detached: true });

    return new Promise((resolve) => {
      ttsProc.on('close', async () => {
        log('edge-tts: remove silence and adjust pitch/rate...');
        await removeSilence(files[0], files[1]);
        await pitch(params.pitch, '24000', files[1], files[2]);
        await rate(params.rate, files[2], files[3]);

        const buffer = fs.readFileSync(files[3]);
        const blob = new Blob([buffer]);

        resolve(blob);

        setTimeout(() => {
          files.forEach((file) => {
            log('edge-tts: delete file ' + file);
            fs.unlinkSync(file);
          });
        }, 100);
      });
    });
  }
}
