import { TTSParams } from '@book-play/models';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import express from 'express';

const TMP_FILE_EXTENSION = '.tmp.mp3';
const MP3_FILE_EXTENSION = '.mp3';

export default class BooksAPIApp {
  killOnClose(
    req: express.Request,
    precess: ChildProcessWithoutNullStreams,
    reject: () => void
  ) {
    req.connection.on('close', () => {
      try {
        process.kill(precess.pid, 9);
      } catch (e: unknown) {
        reject();
      }
      reject();
    });
  }

  runTts(
    params: TTSParams,
    fileName: string,
    req: express.Request
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const { pitch, rate, voice } = params;
      let { text } = params;
      text = text.replace(/\.\s*$/, '');
      const args = [
        `--voice=${
          voice === 'female' ? 'ru-RU-SvetlanaNeural' : 'ru-RU-DmitryNeural'
        }`,
        `--pitch=${pitch > 0 ? '+' + pitch : pitch}Hz`,
        `--rate=${rate > 0 ? '+' + rate : rate}%`,
        '--write-media',
        fileName + TMP_FILE_EXTENSION,
        '--text',
        `"${text}"`,
      ];
      const ttsProc = spawn('edge-tts', args, { detached: true });

      this.killOnClose(req, ttsProc, reject);

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

  async tts(params: TTSParams, req: express.Request): Promise<string> {
    const fileNamePrefix = __dirname + '/cache/part' + Date.now();
    try {
      return this.runTts(params, fileNamePrefix, req);
    } catch (e) {
      console.error(e);
      return '';
    }
  }
}
