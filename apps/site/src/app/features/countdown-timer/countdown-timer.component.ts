import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_COUNTDOWN_TIMER_VALUE } from '@book-play/constants';
import { Store } from '@ngrx/store';
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
} from 'ngx-countdown';
import { AutoPlayService } from '../../shared/services/tts/auto-play.service';
import { settingsSelector } from '../../shared/store/settings/settings.selectors';

@Component({
  selector: 'countdown-timer',
  imports: [CountdownComponent],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownTimerComponent {
  private autoPlayService = inject(AutoPlayService);
  protected stopped = toSignal(this.autoPlayService.stopped$);
  protected countdownConfig: CountdownConfig = {
    leftTime: DEFAULT_COUNTDOWN_TIMER_VALUE,
    format: 'HH:mm:ss',
    demand: true,
    notify: 1,
  };
  private countDownComponent = viewChild(CountdownComponent);
  private store = inject(Store);
  private settings = this.store.selectSignal(settingsSelector);

  constructor() {
    effect(() => {
      this.checkStopped();
    });

    effect(() => {
      this.countdownConfig.leftTime = this.settings().timer;
    });
  }

  protected togglePlay() {
    this.autoPlayService.toggle();
  }

  protected trigger($event: CountdownEvent) {
    if ($event.action === 'done') {
      this.autoPlayService.stop();
      this.resetTimer();
    }
  }

  protected resetTimer() {
    this.countDownComponent()?.restart();
    this.checkStopped();
  }

  private checkStopped() {
    if (this.stopped()) {
      this.countDownComponent()?.pause();
    } else {
      this.countDownComponent()?.resume();
    }
  }
}
