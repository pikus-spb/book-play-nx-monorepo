import {
  YANDEX_TTS_API_DEFAULT_OPTIONS,
  YANDEX_TTS_API_URL,
} from '@book-play/constants';
import { TtsParams, Voices } from '@book-play/models';
import { createQueryString, Log, log } from '@book-play/utils-common';
import {
  equalize,
  getRandomFileNames,
  pitch,
  rate,
} from '@book-play/utils-node';
import fs from 'fs';

export default class YandexTtsApp {
  @Log()
  public tts(params: TtsParams): Promise<Blob> {
    const postParams = {
      ...YANDEX_TTS_API_DEFAULT_OPTIONS,
      speed: '1.0',
      speaker: params.voice,
      text: encodeURIComponent(params.text),
    };

    log('yandex-tts: ' + JSON.stringify(postParams));
    return fetch(YANDEX_TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createQueryString(postParams),
    }).then((response) => response.blob());
  }

  @Log()
  private equalize(
    voice: string,
    fileName: string,
    fileNameOut: string
  ): Promise<string> {
    let equalizer = [
      'equalizer=f=2000:width_type=h:width=2000:g=8',
      'equalizer=f=12000:width_type=h:width=3000:g=10',
      'equalizer=f=80:width_type=h:width=150:g=5',
    ];
    if (voice == Voices.Zahar) {
      equalizer = [
        'equalizer=f=2000:width_type=h:width=2000:g=5',
        'equalizer=f=12000:width_type=h:width=3000:g=10',
      ];
    } else if (voice == Voices.Ermil) {
      equalizer = [
        'equalizer=f=2000:width_type=h:width=2000:g=17',
        'equalizer=f=60:width_type=h:width=150:g=-10',
      ];
    }

    log('yandex-tts equalizer: ' + equalizer.join(', '));
    return equalize(equalizer, fileName, fileNameOut);
  }

  public async runTts(params: TtsParams): Promise<Blob> {
    let blob = await this.tts(params);
    let buffer = Buffer.from(await blob.arrayBuffer());

    const files = getRandomFileNames(4, '.mp3');

    fs.writeFileSync(files[0], buffer);

    log('yandex-tts: post-process audio...');
    await this.equalize(params.voice, files[0], files[1]);
    await pitch(params.pitch, '48000', files[1], files[2]);
    await rate(params.rate, files[2], files[3]);

    buffer = fs.readFileSync(files[3]);
    blob = new Blob([buffer]);

    setTimeout(() => {
      files.forEach((file) => {
        log('yandex-tts: delete file ' + file);
        fs.unlinkSync(file);
      });
    }, 100);

    return blob;
  }
}
