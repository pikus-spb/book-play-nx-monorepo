import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'root',
  templateUrl: 'root.component.html',
  styleUrl: 'root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RootComponent {}
