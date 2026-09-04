import { environment } from '@book-play/constants';
import { TtsParams, Voices } from '@book-play/models';
import { error, Log, log } from '@book-play/utils-common';
import {
  createAbortError,
  equalize,
  getRandomFileNames,
  pitch,
  rate,
  removeSilence,
  throwIfAborted,
} from '@book-play/utils-node';
import { ChildProcess, spawn } from 'child_process';
import fs from 'fs';

export default class PiperTtsApp {
  @Log()
  public runTts(params: TtsParams, signal?: AbortSignal): Promise<Blob> {
    return new Promise((resolve, reject) => {
      throwIfAborted(signal);

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

      let settled = false;
      const cleanup = () => {
        signal?.removeEventListener('abort', abortHandler);
        setTimeout(() => {
          files.forEach((file) => {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
        }, 300);
      };

      const resolveOnce = (blob: Blob) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        resolve(blob);
      };

      const rejectOnce = (reason?: any) => {
        if (settled) {
          return;
        }

        settled = true;
        this.killTtsProcess(child1);
        this.killTtsProcess(child2);
        cleanup();
        reject(reason);
      };

      const abortHandler = () => {
        rejectOnce(createAbortError());
      };

      signal?.addEventListener('abort', abortHandler, { once: true });
      if (signal?.aborted) {
        abortHandler();
        return;
      }

      child1.on('error', rejectOnce);
      child2.on('error', rejectOnce);

      try {
        child1.stdout.pipe(child2.stdin);
        child1.stdin.write(params.text);
        child1.stdin.end();
      } catch (e) {
        rejectOnce(e);
        return;
      }

      child2.on('close', async () => {
        try {
          throwIfAborted(signal);
          await this.equalize(params.voice, files[0], files[1], signal);
          await removeSilence(files[1], files[2], { signal });
          await rate(params.rate, files[2], files[3], { signal });
          await pitch(params.pitch, '22050', files[3], files[4], { signal });

          throwIfAborted(signal);
          const buffer = fs.readFileSync(files[4]);
          const blob = new Blob([buffer]);

          resolveOnce(blob);
        } catch (e) {
          rejectOnce(e);
        }
      });
    });
  }

  @Log()
  private killTtsProcess(childProcess: ChildProcess) {
    if (!childProcess.pid || childProcess.killed) {
      return;
    }

    try {
      if (process.platform === 'win32') {
        childProcess.kill();
      } else {
        process.kill(-childProcess.pid, 'SIGTERM');
      }
      log('Successfully killed process ' + childProcess.pid + '.');
    } catch (e) {
      try {
        childProcess.kill();
      } catch {
        error('Could not kill process:' + childProcess.pid);
      }
    }
  }

  @Log()
  private equalize(
    voice: string,
    fileName: string,
    fileNameOut: string,
    signal?: AbortSignal
  ): Promise<string> {
    let equalizer;
    if (voice == Voices.Irina || voice == Voices.Kirill) {
      equalizer = ['equalizer=f=50:width_type=h:width=80:g=7'];
    } else if (voice == Voices.Tamara) {
      equalizer = ['equalizer=f=50:width_type=h:width=80:g=-4'];
    }

    return equalize(equalizer, fileName, fileNameOut, { signal });
  }
}
