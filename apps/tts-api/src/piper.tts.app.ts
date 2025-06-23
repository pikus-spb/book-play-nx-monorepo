import { TtsParams } from '@book-play/models';
import {
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

      const files = getRandomFileNames(4, '.mp3');

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
        await rate(params.rate, files[1], files[2]);
        await pitch(params.pitch, '22050', files[2], files[3]);

        const buffer = fs.readFileSync(files[3]);
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
