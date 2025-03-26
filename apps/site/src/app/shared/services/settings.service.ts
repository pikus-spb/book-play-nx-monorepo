import { Injectable } from '@angular/core';
import { DefaultVoiceSettings, VoiceSettings } from '@book-play/models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public getVoiceSettings(): VoiceSettings {
    const voice = localStorage.getItem('voice') || DefaultVoiceSettings.voice;
    const rate = localStorage.getItem('rate') || DefaultVoiceSettings.rate;
    const pitch = localStorage.getItem('pitch') || DefaultVoiceSettings.pitch;
    return { voice, rate, pitch };
  }

  public setVoiceSettings({ voice, rate, pitch }: VoiceSettings): void {
    localStorage.setItem('voice', voice);
    localStorage.setItem('rate', rate);
    localStorage.setItem('pitch', pitch);
  }
}
