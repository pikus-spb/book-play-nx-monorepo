import { Voices } from './tts-params';

export interface Settings extends VoiceSettings {
  timer: number;
}

export interface VoiceSettings {
  voice: Voices;
  rate: string;
  pitch: string;
}

export const DefaultVoiceSettings: VoiceSettings = {
  voice: Voices.Dmitry,
  rate: '0',
  pitch: '0',
};
