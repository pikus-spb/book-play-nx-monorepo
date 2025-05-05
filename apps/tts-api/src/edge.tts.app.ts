import { TtsParams } from '@book-play/models';
import { Blob } from 'buffer';
import { spawn } from 'child_process';
import fs from 'fs';

const TMP_FILE_EXTENSION = '.tmp.mp3';
const MP3_FILE_EXTENSION = '.mp3';

export default class EdgeTtsApp {
  private normalizeEdgeParam(param: string): string {
    if (param === '0') {
      return null;
    }
    if (Number(param) > 0) {
      return `+${param}`;
    }
    return `${param}`;
  }

  private normalizeEdgeParams(params: TtsParams): TtsParams {
    let { text, pitch, rate } = params;

    text = text.replace(/([^.]+)\.$/, '$1');
    pitch = this.normalizeEdgeParam(pitch);
    rate = this.normalizeEdgeParam(rate);

    return { text, rate, pitch, voice: params.voice };
  }

  public runTts(params: TtsParams): Promise<Blob> {
    return new Promise((resolve) => {
      const fileName = __dirname + '/cache/audio-' + Date.now();
      const fileNameTmp = fileName + TMP_FILE_EXTENSION;
      const fileNameFinal = fileName + MP3_FILE_EXTENSION;
      const { text, rate, pitch, voice } = this.normalizeEdgeParams(params);
      const args = [];

      args.push(`--text="${text}"`);
      args.push(`--voice=${voice}`);
      if (pitch !== null) {
        args.push(`--pitch=${pitch}Hz`);
      }
      if (rate !== null) {
        args.push(`--rate=${rate}%`);
      }
      args.push(`--write-media=${fileNameTmp}`);

      const ttsProc = spawn('edge-tts', args, { detached: true });

      ttsProc.on('close', () => {
        const args = [
          fileNameTmp,
          '-C',
          '48',
          fileNameFinal,
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
        removeSilenceProc.on('close', () => {
          setTimeout(() => {
            const buffer = fs.readFileSync(fileNameFinal);
            const blob = new Blob([buffer]);

            resolve(blob);

            fs.unlinkSync(fileNameTmp);
            fs.unlinkSync(fileNameFinal);
          }, 100);
        });
      });
    });
  }
}
