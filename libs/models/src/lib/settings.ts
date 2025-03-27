export interface Settings {
  voice: VoiceSettings;
}

export interface VoiceSettings {
  voice: string;
  rate: string;
  pitch: string;
}

export const DefaultVoiceSettings: VoiceSettings = {
  voice: 'male',
  rate: '0',
  pitch: '0',
};
