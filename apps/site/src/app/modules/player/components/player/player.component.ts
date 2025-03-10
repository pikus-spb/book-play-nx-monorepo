import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { setWindowsTitleWithContext } from '@book-play/utils-browser';
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
export class PlayerComponent implements AfterViewInit {
  public eventState = inject(EventsStateService);

  private activeBookService = inject(ActiveBookService);
  private autoPlay = inject(AutoPlayService);
  private booksApi = inject(BooksApiService);
  private domHelper = inject(DomHelperService);
  private indexedDbStorageService = inject(IndexedDbBookStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public get book(): Signal<Book | null> {
    return this.activeBookService.book;
  }

  public contentLoading: Signal<boolean>;

  constructor() {
    this.contentLoading = this.eventState.get(AppEventNames.contentLoading);

    // Effect to update window title
    effect(() => {
      const book = this.book();
      if (book !== null && this.playerComponentActive()) {
        setWindowsTitleWithContext(book.fullName);
      }
    });
  }

  public async ngAfterViewInit() {
    const id = (await firstValueFrom(this.route.paramMap)).get('id');
    if (id) {
      await this.loadBookFromBE(id);
      this.saveBookToIndexedDB();
    } else {
      this.loadBookFromIndexedDB();
    }

    this.domHelper.showActiveParagraph();
  }

  public playParagraph(index: number): void {
    this.autoPlay.stop();
    this.autoPlay.start(index);
  }

  private loadBookFromIndexedDB() {
    this.indexedDbStorageService.get().then((data) => {
      if (data && data.content.length > 0) {
        const book = new Book(JSON.parse(data.content));
        this.activeBookService.update(book || null);
      }
    });
  }

  private saveBookToIndexedDB() {
    if (this.book()) {
      this.domHelper.showActiveParagraph();
      this.indexedDbStorageService.set(JSON.stringify(this.book()));
    }
  }

  private async loadBookFromBE(id: string) {
    if (id) {
      this.eventState.add(AppEventNames.loading);
      this.eventState.add(AppEventNames.contentLoading);

      const book = await this.booksApi.getBookById(id);
      this.activeBookService.update(book || null);

      this.eventState.remove(AppEventNames.contentLoading);
      this.eventState.remove(AppEventNames.loading);
    }
  }

  private playerComponentActive(): boolean {
    return this.router.url.indexOf('player') > -1;
  }
}
