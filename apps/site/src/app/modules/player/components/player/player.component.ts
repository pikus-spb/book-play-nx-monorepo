import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '@book-play/models';
import {
  ActiveBookService,
  AppEventNames,
  AutoPlayService,
  BooksApiService,
  DomHelperService,
  EventsStateService,
  IndexedDbBookStorageService,
} from '@book-play/services';
import { setWindowsTitleWithContext } from '@book-play/utils';
import { firstValueFrom } from 'rxjs';
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
  public eventState = inject(EventsStateService);

  private activeBookService = inject(ActiveBookService);
  private autoPlay = inject(AutoPlayService);
  private booksApi = inject(BooksApiService);
  private domHelper = inject(DomHelperService);
  private indexedDbStorageService = inject(IndexedDbBookStorageService);
  private route = inject(ActivatedRoute);

  public get book(): Signal<Book | null> {
    return this.activeBookService.book;
  }
  public contentLoading: Signal<boolean>;

  constructor() {
    this.contentLoading = this.eventState.get(AppEventNames.contentLoading);

    effect(async () => {
      let book = this.book();

      if (book !== null) {
        setWindowsTitleWithContext(book.fullName);
      }

      const id = (await firstValueFrom(this.route.paramMap)).get('id');

      if (id) {
        this.eventState.add(AppEventNames.loading);
        this.eventState.add(AppEventNames.contentLoading);

        book = await this.booksApi.getById(id);
        this.activeBookService.update(book || null);

        this.eventState.remove(AppEventNames.contentLoading);
        this.eventState.remove(AppEventNames.loading);
      } else {
        if (book) {
          this.domHelper.showActiveParagraph();
          await this.indexedDbStorageService.set(JSON.stringify(book));
        } else {
          const data = await this.indexedDbStorageService.get();
          if (data && data.content.length > 0) {
            book = new Book(JSON.parse(data.content));
            this.activeBookService.update(book || null);
          }
        }
      }
    });
  }

  public playParagraph(index: number): void {
    this.autoPlay.stop();
    this.autoPlay.start(index);
  }
}
