import { TtsParams } from '@book-play/models';
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
        environment.PIPER_TTS_MODEL_PATH,
        '--output-raw',
      ];
      const child1 = spawn(environment.PIPER_TTS_PIPER_PATH, args1, {
        detached: true,
      });
      const prefix = __dirname + '/cache/audio-' + Date.now();
      const fileName = prefix + '.tmp.mp3';
      const fileNameFinal = prefix + '.mp3';
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
        fileName,
      ];
      const child2 = spawn('/usr/bin/ffmpeg', args2, { detached: true });

      child1.stdout.pipe(child2.stdin);

      child1.stdin.write(params.text);
      child1.stdin.end();

      this.killProcessOnConnectionClose(child1, reject);

      child2.on('close', async () => {
        await this.equalize(fileName, fileNameFinal);

        const buffer = fs.readFileSync(fileNameFinal);
        const blob = new Blob([buffer]);

        setTimeout(() => {
          fs.unlinkSync(fileName);
          fs.unlinkSync(fileNameFinal);
        }, 100);

        resolve(blob);
      });
    });
  }

  private equalize(fileName: string, fileNameOut: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [];

      args.push('-i');
      args.push(fileName);
      args.push('-af');

      const equalizer = [
        'equalizer=f=80:width_type=h:width=50:g=5',
        'equalizer=f=2000:width_type=h:width=2000:g=15',
        'equalizer=f=2600:width_type=h:width=3500:g=-12',
        'equalizer=f=14000:width_type=h:width=3000:g=4',
      ];

      args.push(equalizer.join(','));

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

  private killTtsProcess(process: ChildProcess) {
    // TODO: create logger
    console.log('Request cancelled. Killing ' + process.pid + '...');
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
