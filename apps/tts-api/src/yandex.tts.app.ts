import {
  YANDEX_TTS_API_DEFAULT_OPTIONS,
  YANDEX_TTS_API_URL,
} from '@book-play/constants';
import { TtsParams, Voices } from '@book-play/models';
import { createQueryString } from '@book-play/utils-common';
import { spawn } from 'child_process';
import fs from 'fs';
import { MP3_FILE_EXTENSION, TMP_FILE_EXTENSION } from './main.ts';

export default class YandexTtsApp {
  public tts(params: TtsParams): Promise<Blob> {
    const postParams = {
      ...YANDEX_TTS_API_DEFAULT_OPTIONS,
      speed: this.normalizeSpeed(params.rate),
      speaker: params.voice,
      text: encodeURIComponent(params.text),
    };

    return fetch(YANDEX_TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createQueryString(postParams),
    }).then((response) => response.blob());
  }

  private equalize(
    voice: string,
    fileName: string,
    fileNameOut: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [];

      args.push('-i');
      args.push(fileName);
      args.push('-af');

      let equalizer =
        'equalizer=f=2000:width_type=h:width=2000:g=8,equalizer=f=12000:width_type=h:width=3000:g=10,equalizer=f=80:width_type=h:width=150:g=5';
      if (voice == Voices.Zahar) {
        equalizer =
          'equalizer=f=2000:width_type=h:width=2000:g=5,equalizer=f=12000:width_type=h:width=3000:g=10';
      } else if (voice == Voices.Ermil) {
        equalizer =
          'equalizer=f=2000:width_type=h:width=2000:g=14,equalizer=f=12000:width_type=h:width=3000:g=-3,equalizer=f=80:width_type=h:width=150:g=-10';
      }
      args.push(equalizer);

      args.push(fileNameOut);

      let process;
      try {
        process = spawn('ffmpeg', args, { detached: true });
      } catch (e) {
        console.error(e);
        reject(e);
      }
      process.on('close', () => {
        resolve(fileNameOut);
      });
    });
  }

  public async runTts(params: TtsParams): Promise<Blob> {
    let blob = await this.tts(params);
    let buffer = Buffer.from(await blob.arrayBuffer());

    const randomName = __dirname + '/cache/audio-' + Date.now();
    const fileNameTmp = randomName + TMP_FILE_EXTENSION;
    const fileNameFinal = randomName + MP3_FILE_EXTENSION;

    fs.writeFileSync(fileNameTmp, buffer);

    await this.equalize(params.voice, fileNameTmp, fileNameFinal);

    buffer = fs.readFileSync(fileNameFinal);
    blob = new Blob([buffer]);

    setTimeout(() => {
      fs.unlinkSync(fileNameTmp);
      fs.unlinkSync(fileNameFinal);
    }, 100);

    return blob;
  }

  private normalizeSpeed(speed: string): number {
    return Number(speed) * 0.02 + 1;
  }
}
