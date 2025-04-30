import { inject, Injectable } from '@angular/core';
import { CanDeactivate, GuardResult, MaybeAsync } from '@angular/router';
import { AutoPlayService } from '../../shared/services/tts/auto-play.service';

@Injectable({
  providedIn: 'root',
})
export class StopBookPlayGuard implements CanDeactivate<boolean> {
  private autoPlayService = inject(AutoPlayService);

  canDeactivate(): MaybeAsync<GuardResult> {
    this.autoPlayService.stop();
    return true;
  }
}
