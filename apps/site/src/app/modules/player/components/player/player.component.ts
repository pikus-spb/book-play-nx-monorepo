import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Signal,
} from '@angular/core';
import { Book } from '@book-play/models';
import {
  ActiveBookService,
  AppEventNames,
  AutoPlayService,
  EventsStateService,
} from '@book-play/services';
import { setWindowsTitleWithContext } from '@book-play/utils';
import { MaterialModule } from '../../../../core/modules/material.module';
import { BookCanvasComponent } from '../book-canvas/book-canvas.component';
import { CanvasSkeletonComponent } from '../canvas-skeleton/canvas-skeleton.component';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, BookCanvasComponent, CanvasSkeletonComponent],
})
export class PlayerComponent {
  public get book(): Signal<Book | null> {
    return this.activeBookService.book;
  }
  public contentLoading: Signal<boolean>;

  constructor(
    public eventState: EventsStateService,
    private activeBookService: ActiveBookService,
    private autoPlay: AutoPlayService
  ) {
    this.contentLoading = this.eventState.get(AppEventNames.contentLoading);

    effect(() => {
      const book = this.book();
      if (book !== null) {
        setWindowsTitleWithContext(book.fullName);
      }
    });
  }

  public playParagraph(index: number): void {
    this.autoPlay.stop();
    this.autoPlay.start(index);
  }
}
