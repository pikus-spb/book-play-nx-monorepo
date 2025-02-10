import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Signal,
} from '@angular/core';
import { MaterialModule } from 'app/core/modules/material.module';
import { BookCanvasComponent } from 'app/modules/player/components/book-canvas/book-canvas.component';
import { CanvasSkeletonComponent } from 'app/modules/player/components/canvas-skeleton/canvas-skeleton.component';
import { BookData } from 'app/shared/model/fb2-book.types';
import { ActiveBookService } from 'app/shared/services/active-book.service';
import { AutoPlayService } from 'app/shared/services/auto-play.service';
import { BookStringsService } from 'app/shared/services/book-strings.service';
import { DocumentTitleService } from 'app/shared/services/document-title.service';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';

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
