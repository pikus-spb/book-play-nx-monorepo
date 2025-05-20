import {
  YANDEX_TTS_API_DEFAULT_OPTIONS,
  YANDEX_TTS_API_URL,
} from '@book-play/constants';
import { TtsParams, Voices } from '@book-play/models';
import { createQueryString } from '@book-play/utils-common';
import { getRandomFileName, pitch } from '@book-play/utils-node';
import { spawn } from 'child_process';
import fs from 'fs';

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
          'equalizer=f=2000:width_type=h:width=2000:g=17,equalizer=f=80:width_type=h:width=150:g=-9';
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

    const files = new Array(3)
      .fill(null)
      .map(() => getRandomFileName('.mp3', '/cache/'));

    fs.writeFileSync(files[0], buffer);

    await this.equalize(params.voice, files[0], files[1]);
    await pitch(params.pitch, '48000', files[1], files[2]);

    buffer = fs.readFileSync(files[2]);
    blob = new Blob([buffer]);

    setTimeout(() => {
      files.forEach((file) => {
        fs.unlinkSync(file);
      });
    }, 100);

    return blob;
  }

  private normalizeSpeed(speed: string): number {
    return Number(speed) * 0.01 + 1;
  }
}
