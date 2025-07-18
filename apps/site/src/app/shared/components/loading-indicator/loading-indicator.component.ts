import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'loading-indicator',
  imports: [MatProgressBar],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicatorComponent {
  protected hidden: WritableSignal<boolean> = signal(true);

  public show() {
    this.hidden.set(false);
  }

  public hide() {
    this.hidden.set(true);
  }
}
