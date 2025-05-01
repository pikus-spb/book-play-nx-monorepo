import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { AutoPlayService } from '../../services/tts/auto-play.service';

@Component({
  selector: 'player-button',
  templateUrl: 'player-button.component.html',
  styleUrl: 'player-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMiniFabButton, MatTooltip, MatIcon, AsyncPipe],
})
export class PlayerButtonComponent {
  constructor(public autoPlayService: AutoPlayService) {}

  @HostListener('document:keydown.space', ['$event'])
  public click(event: Event, forceStart?: boolean) {
    const node = event.target as HTMLElement;
    if (node) {
      if (forceStart === undefined) {
        this.autoPlayService.toggle();
      } else if (forceStart) {
        this.autoPlayService.start();
      } else {
        this.autoPlayService.stop();
      }
    }
  }
}
