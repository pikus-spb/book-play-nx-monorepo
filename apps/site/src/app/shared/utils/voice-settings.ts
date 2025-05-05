import { DefaultVoiceSettings, Voices, VoiceSettings } from '@book-play/models';

export function getVoiceSettings(): VoiceSettings {
  const voice = localStorage.getItem('voice') || DefaultVoiceSettings.voice;
  const rate = localStorage.getItem('rate') || DefaultVoiceSettings.rate;
  const pitch = localStorage.getItem('pitch') || DefaultVoiceSettings.pitch;
  return { voice: voice as Voices, rate, pitch };
}

export function storeVoiceSettings({
  voice,
  rate,
  pitch,
}: VoiceSettings): void {
  localStorage.setItem('voice', voice || DefaultVoiceSettings.voice);
  localStorage.setItem('rate', rate || DefaultVoiceSettings.rate);
  localStorage.setItem('pitch', pitch || DefaultVoiceSettings.pitch);
}
