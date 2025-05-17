export enum Voices {
  Svetlana = 'ru-RU-SvetlanaNeural',
  Dmitry = 'ru-RU-DmitryNeural',
  Ermil = 'ermil',
  Jane = 'jane',
  Zahar = 'zahar',
  Omazh = 'omazh',
  Piper = 'piper',
}

export interface TtsParams {
  text: string;
  pitch: string | null;
  rate: string | null;
  voice: Voices;
}
