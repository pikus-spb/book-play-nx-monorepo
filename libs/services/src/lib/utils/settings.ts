import { DEFAULT_COUNTDOWN_TIMER_VALUE } from '@book-play/constants';
import {
  DefaultSettings,
  ReaderViewMode,
  Settings,
  Voices,
} from '@book-play/models';

export function getSettings(): Settings {
  const voice = localStorage.getItem('voice') || DefaultSettings.voice;
  const rate = localStorage.getItem('rate') || DefaultSettings.rate;
  const pitch = localStorage.getItem('pitch') || DefaultSettings.pitch;
  const readerViewMode = (localStorage.getItem('readerViewMode') ||
    DefaultSettings.readerViewMode) as ReaderViewMode;
  const timerStored = localStorage.getItem('timer');
  const timer =
    timerStored === null ? DEFAULT_COUNTDOWN_TIMER_VALUE : Number(timerStored);
  return { voice: voice as Voices, rate, pitch, timer, readerViewMode };
}

export function storeSettings({
  voice,
  rate,
  pitch,
  timer,
  readerViewMode,
}: Settings): void {
  localStorage.setItem('voice', voice || DefaultSettings.voice);
  localStorage.setItem('rate', rate || DefaultSettings.rate);
  localStorage.setItem('pitch', pitch || DefaultSettings.pitch);
  localStorage.setItem(
    'readerViewMode',
    readerViewMode || DefaultSettings.readerViewMode
  );
  localStorage.setItem('timer', String(timer ?? DEFAULT_COUNTDOWN_TIMER_VALUE));
}
