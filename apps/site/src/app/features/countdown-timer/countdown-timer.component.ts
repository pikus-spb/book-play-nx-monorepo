import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_COUNTDOWN_TIMER_VALUE } from '@book-play/constants';
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
} from 'ngx-countdown';
import { AutoPlayService } from '../../shared/services/tts/auto-play.service';

@Component({
  selector: 'countdown-timer',
  imports: [CountdownComponent],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownTimerComponent implements OnInit {
  private autoPlayService = inject(AutoPlayService);
  protected stopped = toSignal(this.autoPlayService.stopped$);
  protected countdownConfig: CountdownConfig = {
    leftTime: DEFAULT_COUNTDOWN_TIMER_VALUE,
    format: 'HH:mm:ss',
    demand: true,
    notify: 1,
  };
  private countDownComponent = viewChild(CountdownComponent);

  constructor() {
    effect(() => {
      this.checkStopped();
    });
  }

  public ngOnInit() {
    this.countdownConfig.leftTime =
      Number(localStorage.getItem('countdownTimerValue')) ||
      DEFAULT_COUNTDOWN_TIMER_VALUE;
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
