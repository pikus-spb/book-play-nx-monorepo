import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Signal,
} from '@angular/core';
import { BookData } from '@book-play/models';
import {
  ActiveBookService,
  AppEventNames,
  AutoPlayService,
  BookStringsService,
  DocumentTitleService,
  EventsStateService,
} from '@book-play/services';
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
  public get book(): Signal<BookData | null> {
    return this.activeBookService.book;
  }
  public contentLoading: Signal<boolean>;

  constructor(
    public eventState: EventsStateService,
    private activeBookService: ActiveBookService,
    private autoPlay: AutoPlayService,
    private documentTitle: DocumentTitleService,
    private bookUtils: BookStringsService
  ) {
    this.contentLoading = this.eventState.get(AppEventNames.contentLoading);

    effect(() => {
      const book = this.book();
      if (book !== null) {
        this.documentTitle.setContextTitle(
          this.bookUtils.getBookFullDisplayName(book)
        );
      }
    });
  }

  public playParagraph(index: number): void {
    this.autoPlay.stop();
    this.autoPlay.start(index);
  }
}
