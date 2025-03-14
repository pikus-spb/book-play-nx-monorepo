import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { AutoPlayService } from '@book-play/services';
import { MaterialModule } from '../../../core/modules/material.module';

@Component({
  selector: 'player-button',
  templateUrl: 'player-button.component.html',
  styleUrl: 'player-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule],
})
export class PlayerButtonComponent {
  constructor(public autoPlay: AutoPlayService) {}

  @HostListener('document:keydown.Space', ['$event'])
  public click(event: Event, start?: boolean) {
    const node = event.target as HTMLElement;
    if (node) {
      if (!['input', 'textarea'].includes(node.nodeName.toLowerCase())) {
        event.preventDefault();
        if (start === undefined) {
          this.autoPlay.toggle();
        } else if (start) {
          this.autoPlay.start();
        } else {
          this.autoPlay.stop();
        }
      }
    }
  }
}
