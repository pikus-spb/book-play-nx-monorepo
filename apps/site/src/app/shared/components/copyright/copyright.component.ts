import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CopyrightComponent {}
