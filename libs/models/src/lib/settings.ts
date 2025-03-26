export interface Settings {
  voice: VoiceSettings;
}

export interface VoiceSettings {
  voice: string;
  rate: string;
  pitch: string;
}

export const DefaultVoiceSettings: VoiceSettings = {
  voice: 'female',
  rate: '1',
  pitch: '-1',
};
