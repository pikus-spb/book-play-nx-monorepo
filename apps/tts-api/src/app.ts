import { TTSParams } from '@book-play/models';
import { spawn } from 'child_process';
import fs from 'fs';

const TMP_FILE_EXTENSION = '.tmp.mp3';
const MP3_FILE_EXTENSION = '.mp3';

export default class BooksAPIApp {
  private normalizeParam(param: string): string {
    if (param === '0') {
      return null;
    }
    if (Number(param) > 0) {
      return `+${param}`;
    }
    return `${param}`;
  }

  private normalizeParams(params: TTSParams) {
    let { text, pitch, rate, voice } = params;

    text = text.replace(/([^.]+)\.$/, '$1');
    pitch = this.normalizeParam(pitch);
    rate = this.normalizeParam(rate);
    voice = voice === 'female' ? 'ru-RU-SvetlanaNeural' : 'ru-RU-DmitryNeural';

    return { text, rate, pitch, voice };
  }

  runTts(params: TTSParams, fileName: string): Promise<string> {
    return new Promise((resolve) => {
      const { text, rate, pitch, voice } = this.normalizeParams(params);

      const args = [];

      args.push(`--text="${text}"`);
      args.push(`--voice=${voice}`);
      if (pitch !== null) {
        args.push(`--pitch=${pitch}Hz`);
      }
      if (rate !== null) {
        args.push(`--rate=${rate}%`);
      }
      args.push(`--write-media=${fileName + TMP_FILE_EXTENSION}`);

      const ttsProc = spawn('edge-tts', args, { detached: true });

      ttsProc.on('close', () => {
        const args = [
          fileName + TMP_FILE_EXTENSION,
          '-C',
          '48',
          fileName + MP3_FILE_EXTENSION,
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
          setTimeout(() => resolve(fileName + MP3_FILE_EXTENSION), 200);
        });
      });
    });
  }

  async tts(params: TTSParams): Promise<string> {
    const fileNamePrefix = __dirname + '/cache/part' + Date.now();
    try {
      return this.runTts(params, fileNamePrefix).then((filename) => {
        fs.unlinkSync(fileNamePrefix + TMP_FILE_EXTENSION);
        return filename;
      });
    } catch (e) {
      console.error(e);
      return '';
    }
  }
}
