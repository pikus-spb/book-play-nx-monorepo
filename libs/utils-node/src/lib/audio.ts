import {
  SETTINGS_VOICE_PITCH_DELTA,
  SETTINGS_VOICE_RATE_DELTA,
} from '@book-play/constants';
import { ChildProcess, spawn } from 'child_process';

export interface AudioProcessingOptions {
  signal?: AbortSignal;
}

export function createAbortError(): Error {
  const abortError = new Error('Http request cancelled');
  abortError.name = 'AbortError';
  return abortError;
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw createAbortError();
  }
}

export function isAbortError(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }

  const maybeAbortError = err as { name?: unknown; message?: unknown };

  return (
    maybeAbortError.name === 'AbortError' ||
    maybeAbortError.message === 'Http request cancelled'
  );
}

function killProcess(childProcess: ChildProcess): void {
  if (!childProcess.pid || childProcess.killed) {
    return;
  }

  try {
    if (process.platform === 'win32') {
      childProcess.kill();
    } else {
      process.kill(-childProcess.pid, 'SIGTERM');
    }
  } catch {
    try {
      childProcess.kill();
    } catch {
      // The process may already be gone.
    }
  }
}

export function runProcess(
  command: string,
  args: string[],
  options: AudioProcessingOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    throwIfAborted(options.signal);

    let settled = false;
    let childProcess: ChildProcess;

    const cleanup = () => {
      options.signal?.removeEventListener('abort', abortHandler);
    };

    const resolveOnce = () => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve();
    };

    const rejectOnce = (err: unknown) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      reject(err);
    };

    const abortHandler = () => {
      killProcess(childProcess);
      rejectOnce(createAbortError());
    };

    try {
      childProcess = spawn(command, args, { detached: true });
    } catch (e) {
      rejectOnce(e);
      return;
    }

    options.signal?.addEventListener('abort', abortHandler, { once: true });

    if (options.signal?.aborted) {
      abortHandler();
      return;
    }

    childProcess.on('error', rejectOnce);
    childProcess.on('close', resolveOnce);
  });
}

export function pitch(
  pitch: string | null | undefined,
  sampleRate: string,
  fileName: string,
  fileNameOut: string,
  options: AudioProcessingOptions = {}
): Promise<string> {
  const args = [];
  const pitchNormalized = (
    Number(pitch) / (SETTINGS_VOICE_PITCH_DELTA * 5) +
    1
  ).toFixed(3);

  args.push('-i');
  args.push(fileName);
  args.push('-af');
  args.push(
    [
      `asetrate=${sampleRate}*${pitchNormalized}`,
      `aresample=${sampleRate}`,
      `atempo=1/${pitchNormalized}`,
    ].join(',')
  );
  args.push('-b:a');
  args.push('128k');
  args.push(fileNameOut);

  return runProcess('ffmpeg', args, options).then(() => fileNameOut);
}

export function rate(
  rate: string | null | undefined,
  fileName: string,
  fileNameOut: string,
  options: AudioProcessingOptions = {}
): Promise<string> {
  const args = [];

  let rateNormalized = Number(rate) / SETTINGS_VOICE_RATE_DELTA + 1;
  if (rateNormalized < 0.5) {
    rateNormalized = 0.5;
  }

  args.push('-i');
  args.push(fileName);
  args.push('-filter:a');
  args.push(`atempo=${rateNormalized}`);
  args.push('-b:a');
  args.push('128k');
  args.push(fileNameOut);

  return runProcess('ffmpeg', args, options).then(() => fileNameOut);
}

export function removeSilence(
  fileName: string,
  fileNameOut: string,
  options: AudioProcessingOptions = {}
): Promise<string> {
  const args = [
    fileName,
    '-C',
    '128',
    fileNameOut,
    'silence',
    '-l',
    '1',
    '0.001',
    '1%',
    '-1',
    '0.7',
    '1%',
  ];

  return runProcess('sox', args, options).then(() => fileNameOut);
}

export function appendSilence(
  fileName: string,
  fileNameOut: string,
  seconds: number,
  options: AudioProcessingOptions = {}
): Promise<string> {
  const args = [
    '-i',
    fileName,
    '-af',
    `apad=pad_dur=${seconds}`,
    '-b:a',
    '128k',
    fileNameOut,
  ];

  return runProcess('ffmpeg', args, options).then(() => fileNameOut);
}

export function resampleToHigherBitRate(
  fileName: string,
  fileNameOut: string,
  options: AudioProcessingOptions = {}
): Promise<string> {
  const args = [fileName, '-C', '128', fileNameOut];

  return runProcess('sox', args, options).then(() => fileNameOut);
}

export function equalize(
  equalizer: string[] | undefined,
  fileName: string,
  fileNameOut: string,
  options: AudioProcessingOptions = {}
): Promise<string> {
  const args = ['-i', fileName];
  if (equalizer?.length) {
    args.push('-af');
    args.push(equalizer.join(','));
  }
  args.push(fileNameOut);

  return runProcess('ffmpeg', args, options).then(() => fileNameOut);
}
