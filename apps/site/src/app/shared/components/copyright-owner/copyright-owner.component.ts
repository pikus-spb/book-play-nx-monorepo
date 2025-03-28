import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'copyright-owner',
  templateUrl: './copyright-owner.component.html',
  styleUrls: ['./copyright-owner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink],
})
export class CopyrightOwnerComponent {}
