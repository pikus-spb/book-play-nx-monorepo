import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';

@Component({
  selector: 'root',
  templateUrl: 'root.component.html',
  styleUrl: 'root.component.scss',
  imports: [MaterialModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {}
