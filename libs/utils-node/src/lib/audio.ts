import {
  SETTINGS_VOICE_PITCH_DELTA,
  SETTINGS_VOICE_RATE_DELTA,
} from '@book-play/constants';
import { spawn } from 'child_process';

export function pitch(
  pitch: string,
  sampleRate: string,
  fileName: string,
  fileNameOut: string
): Promise<string> {
  return new Promise((resolve, reject) => {
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

export function rate(
  rate: string,
  fileName: string,
  fileNameOut: string
): Promise<string> {
  return new Promise((resolve, reject) => {
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

export function removeSilence(
  fileName: string,
  fileNameOut: string
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
    '0.6',
    '1%',
  ];
  const removeSilenceProc = spawn('sox', args, { detached: true });
  return new Promise((resolve) => {
    removeSilenceProc.on('close', () => {
      resolve(fileNameOut);
    });
  });
}

export function equalize(
  equalizer: string[],
  fileName: string,
  fileNameOut: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = ['-i', fileName, '-af', equalizer.join(','), fileNameOut];

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
