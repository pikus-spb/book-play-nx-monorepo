export enum Voices {
  Svetlana = 'ru-RU-SvetlanaNeural',
  Dmitry = 'ru-RU-DmitryNeural',
  Ermil = 'ermil',
  Jane = 'jane',
}

export interface TtsParams {
  text: string;
  pitch: string | null;
  rate: string | null;
  voice: Voices;
}
