import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
  Signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';
import { BooksApiService } from 'app/modules/library/services/books-api.service';
import { BookCanvasComponent } from 'app/modules/player/components/book-canvas/book-canvas.component';
import { CanvasSkeletonComponent } from 'app/modules/player/components/canvas-skeleton/canvas-skeleton.component';
import { AutoPlayService } from 'app/modules/player/services/auto-play.service';
import { DomHelperService } from 'app/modules/player/services/dom-helper.service';
import { OpenedBookService } from 'app/modules/player/services/opened-book.service';
import { BookData } from 'app/shared/model/fb2-book.types';
import { BookUtilsService } from 'app/shared/services/book-utils.service';
import { DocumentTitleService } from 'app/shared/services/document-title.service';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';
import { Fb2ReaderService } from 'app/shared/services/fb2-reader.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, BookCanvasComponent, CanvasSkeletonComponent],
})
export class PlayerComponent implements OnInit {
  public get book(): Signal<BookData | null> {
    return this.openedBookService.book;
  }
  public contentLoading: Signal<boolean>;

  constructor(
    public eventState: EventsStateService,
    private openedBookService: OpenedBookService,
    private autoPlay: AutoPlayService,
    private route: ActivatedRoute,
    private domHelper: DomHelperService,
    private booksApi: BooksApiService,
    private fb2Reader: Fb2ReaderService,
    private eventStates: EventsStateService,
    private documentTitle: DocumentTitleService,
    private bookUtils: BookUtilsService
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

  public ngOnInit() {
    this.prepeareBook();
  }

  private async prepeareBook() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.eventStates.add(AppEventNames.loading);
      this.eventStates.add(AppEventNames.contentLoading);

      this.openedBookService.update(null);

      const book = await this.booksApi.getById(id);
      const bookData = this.fb2Reader.readBookFromString(book.content);
      this.openedBookService.update(bookData);

      this.eventStates.remove(AppEventNames.contentLoading);
      this.eventStates.remove(AppEventNames.loading);
    } else {
      this.domHelper.showActiveParagraph();
    }
  }
}
