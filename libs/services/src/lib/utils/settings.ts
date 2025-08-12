import { DEFAULT_COUNTDOWN_TIMER_VALUE } from '@book-play/constants';
import { DefaultVoiceSettings, Settings, Voices } from '@book-play/models';

export function getSettings(): Settings {
  const voice = localStorage.getItem('voice') || DefaultVoiceSettings.voice;
  const rate = localStorage.getItem('rate') || DefaultVoiceSettings.rate;
  const pitch = localStorage.getItem('pitch') || DefaultVoiceSettings.pitch;
  const timerStored = localStorage.getItem('timer');
  const timer =
    timerStored === null ? DEFAULT_COUNTDOWN_TIMER_VALUE : Number(timerStored);
  return { voice: voice as Voices, rate, pitch, timer };
}

export function storeSettings({ voice, rate, pitch, timer }: Settings): void {
  localStorage.setItem('voice', voice || DefaultVoiceSettings.voice);
  localStorage.setItem('rate', rate || DefaultVoiceSettings.rate);
  localStorage.setItem('pitch', pitch || DefaultVoiceSettings.pitch);
  localStorage.setItem('timer', String(timer ?? DEFAULT_COUNTDOWN_TIMER_VALUE));
}
