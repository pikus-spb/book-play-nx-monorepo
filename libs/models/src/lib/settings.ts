import { Voices } from './tts-params';

export type ReaderViewMode = 'white' | 'warm' | 'dark' | 'black';

export interface Settings extends VoiceSettings {
  timer: number;
  readerViewMode: ReaderViewMode;
}

export interface VoiceSettings {
  voice: Voices;
  rate: string;
  pitch: string;
}

export const DefaultSettings: Settings = {
  readerViewMode: 'warm',
  timer: 0,
  voice: Voices.Dmitry,
  rate: '0',
  pitch: '0',
};
