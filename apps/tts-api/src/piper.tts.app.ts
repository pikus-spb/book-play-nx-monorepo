import { TtsParams, Voices } from '@book-play/models';
import {
  equalize,
  getRandomFileNames,
  pitch,
  rate,
  removeSilence,
} from '@book-play/utils-node';
import { ChildProcess, spawn } from 'child_process';
import { environment } from 'environments/environment';
import express from 'express';
import fs from 'fs';

export default class PiperTtsApp {
  private req: express.Request;

  constructor(req: express.Request) {
    this.req = req;
  }

  public runTts(params: TtsParams): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const args1 = [
        '--model',
        environment.PIPER_TTS_PATH + '/model.' + params.voice + '.onnx',
        '--output-raw',
      ];

      const child1 = spawn(environment.PIPER_TTS_PATH + '/piper', args1, {
        detached: true,
      });

      const files = getRandomFileNames(5, '.mp3');

      const args2 = [
        '-f',
        's16le',
        '-ar',
        '22500',
        '-ac',
        '1',
        '-i',
        'pipe:',
        '-f',
        'mp3',
        files[0],
      ];
      const child2 = spawn('/usr/bin/ffmpeg', args2, { detached: true });

      child1.stdout.pipe(child2.stdin);

      child1.stdin.write(params.text);
      child1.stdin.end();

      this.killProcessOnConnectionClose(child1, reject);

      child2.on('close', async () => {
        await removeSilence(files[0], files[1]);
        await this.equalize(params.voice, files[1], files[2]);
        await rate(params.rate, files[2], files[3]);
        await pitch(params.pitch, '22050', files[3], files[4]);

        const buffer = fs.readFileSync(files[4]);
        const blob = new Blob([buffer]);

        setTimeout(() => {
          files.forEach((file) => {
            fs.unlinkSync(file);
          });
        }, 300);

        resolve(blob);
      });
    });
  }

  private equalize(
    voice: Voices,
    fileName: string,
    fileNameOut: string
  ): Promise<string> {
    let equalizer: string[];
    if (voice === Voices.Tamara) {
      equalizer = [
        'equalizer=f=80:width_type=h:width=50:g=5',
        'equalizer=f=3500:width_type=h:width=5000:g=-5',
      ];
    } else if (voice === Voices.Kirill) {
      equalizer = [
        'equalizer=f=60:width_type=h:width=150:g=11',
        'equalizer=f=2000:width_type=h:width=2000:g=15',
        'equalizer=f=2600:width_type=h:width=3500:g=-10',
        'equalizer=f=14000:width_type=h:width=3000:g=5',
      ];
    } else if (voice === Voices.Irina) {
      equalizer = [
        'equalizer=f=150:width_type=h:width=150:g=5',
        'equalizer=f=14000:width_type=h:width=3000:g=4',
      ];
    }

    return equalize(equalizer, fileName, fileNameOut);
  }

  private killTtsProcess(process: ChildProcess) {
    // TODO: create logger
    try {
      process.kill(process.pid);
      console.log('Successfully killed process ' + process.pid + '.');
    } catch (e) {
      console.log('Could not kill process:' + process.pid);
    }
  }

  private killProcessOnConnectionClose(
    child: ChildProcess,
    reject: (reason?: any) => void
  ) {
    this.req.connection.once('close', () => {
      this.killTtsProcess(child);
      reject('Http request cancelled');
    });
  }
}
