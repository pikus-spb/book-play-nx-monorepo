import { TtsParams } from '@book-play/models';
import { Log } from '@book-play/utils-common';
import {
  getRandomFileNames,
  pitch,
  rate,
  removeSilence,
} from '@book-play/utils-node';
import { Blob } from 'buffer';
import fs from 'fs';
import googleTTS from 'node-google-tts-api';

const VOICE_SPEED_FIX_DELTA = 4;

export default class GoogleTtsApp {
  @Log()
  public async runTts(params: TtsParams): Promise<Blob> {
    const { text } = params;
    const files = getRandomFileNames(4, '.mp3');
    const tts = new googleTTS();

    const mp3s = await tts.get({
      text,
      lang: "ru",
      limit_bypass: true
    })
    const result = tts.concat([mp3s].flat());
    
    fs.writeFileSync(files[0], result);

    await removeSilence(files[0], files[1]);
    await pitch(params.pitch, '24000', files[1], files[2]);
    await rate((Number(params.rate) - VOICE_SPEED_FIX_DELTA).toString(), files[2], files[3]);

    const buffer = fs.readFileSync(files[3]);
    const blob = new Blob([buffer]);

    setTimeout(() => {
          files.forEach((file) => {
            fs.unlinkSync(file);
          });
        }, 100);

    return blob;
  }
}
