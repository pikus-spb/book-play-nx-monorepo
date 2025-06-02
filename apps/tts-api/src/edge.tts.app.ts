import { TtsParams } from '@book-play/models';
import { getRandomFileNames, pitch, rate } from '@book-play/utils-node';
import { Blob } from 'buffer';
import { spawn } from 'child_process';
import fs from 'fs';

export default class EdgeTtsApp {
  private normalizeText(text: string): string {
    return text.replace(/([^.]+)\.$/, '$1');
  }

  private removeSilence(
    fileName: string,
    fileNameOut: string
  ): Promise<string> {
    const args = [
      fileName,
      '-C',
      '48',
      fileNameOut,
      'silence',
      '-l',
      '1',
      '0.001',
      '1%',
      '-1',
      '0.6',
      '1%',
    ];
    const removeSilenceProc = spawn('sox', args, { detached: true });
    return new Promise((resolve) => {
      removeSilenceProc.on('close', () => {
        resolve(fileNameOut);
      });
    });
  }

  public runTts(params: TtsParams): Promise<Blob> {
    const { text, voice } = params;
    const files = getRandomFileNames(4, '.mp3');

    const args = [];
    args.push(`--text="${this.normalizeText(text)}"`);
    args.push(`--voice=${voice}`);
    args.push(`--write-media=${files[0]}`);

    const ttsProc = spawn('edge-tts', args, { detached: true });

    return new Promise((resolve) => {
      ttsProc.on('close', async () => {
        await this.removeSilence(files[0], files[1]);
        await pitch(params.pitch, '24000', files[1], files[2]);
        await rate(params.rate, files[2], files[3]);

        const buffer = fs.readFileSync(files[3]);
        const blob = new Blob([buffer]);

        resolve(blob);

        setTimeout(() => {
          files.forEach((file) => {
            fs.unlinkSync(file);
          });
        }, 100);
      });
    });
  }
}
