import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';
import { BooksApiService } from 'app/modules/library/services/books-api.service';
import { BookCanvasComponent } from 'app/modules/player/components/book-canvas/book-canvas.component';
import { CanvasSkeletonComponent } from 'app/modules/player/components/canvas-skeleton/canvas-skeleton.component';
import { ActiveBookService } from 'app/modules/player/services/active-book.service';
import { AutoPlayService } from 'app/modules/player/services/auto-play.service';
import { DomHelperService } from 'app/modules/player/services/dom-helper.service';
import { BookData } from 'app/shared/model/fb2-book.types';
import { BookStringsService } from 'app/shared/services/book-strings.service';
import { DocumentTitleService } from 'app/shared/services/document-title.service';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';
import { Fb2ParsingService } from 'app/shared/services/fb2-parsing.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, BookCanvasComponent, CanvasSkeletonComponent],
})
export class PlayerComponent implements OnInit {
  public get book(): Signal<BookData | null> {
    return this.activeBookService.book;
  }
  public contentLoading: Signal<boolean>;

  private route = inject(ActivatedRoute);

  constructor(
    public eventState: EventsStateService,
    private activeBookService: ActiveBookService,
    private autoPlay: AutoPlayService,
    private domHelper: DomHelperService,
    private booksApi: BooksApiService,
    private fb2ParsingService: Fb2ParsingService,
    private eventStates: EventsStateService,
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

  public ngOnInit() {
    this.tryLoadBookFromLibrary();
  }

  private async tryLoadBookFromLibrary() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.eventStates.add(AppEventNames.loading);
      this.eventStates.add(AppEventNames.contentLoading);

      this.activeBookService.update(null);

      const book = await this.booksApi.getById(id);
      const bookData = this.fb2ParsingService.parseBookFromString(book.content);
      this.activeBookService.update(bookData);

      this.eventStates.remove(AppEventNames.contentLoading);
      this.eventStates.remove(AppEventNames.loading);
    } else {
      this.domHelper.showActiveParagraph();
    }
  }
}
