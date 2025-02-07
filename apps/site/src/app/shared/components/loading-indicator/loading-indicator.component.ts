import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'loading-indicator',
  imports: [MatProgressBar],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicatorComponent {}
