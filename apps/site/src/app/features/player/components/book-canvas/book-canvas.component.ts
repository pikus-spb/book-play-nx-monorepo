import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  Signal,
  ViewChild,
} from '@angular/core';
import {
  BOOK_IMAGE_HEIGHT,
  BOOK_IMAGE_WIDTH,
  DEFAULT_COVER_SRC,
} from '@book-play/constants';
import { Book, DefaultSettings, HeightDelta } from '@book-play/models';
import {
  DomHelperService,
  setupViewportScrollerService,
  TextIndexMapperService,
} from '@book-play/services';
import { HeightCalculateComponent, StarRatingComponent } from '@book-play/ui';
import { showDefaultCoverImage } from '@book-play/utils-browser';
import { Subject } from 'rxjs';
import { BookParagraphComponent } from '../book-paragraph/book-paragraph.component';

@Component({
  selector: 'book-canvas',
  templateUrl: './book-canvas.component.html',
  styleUrls: ['./book-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ScrollingModule,
    ExperimentalScrollingModule,
    BookParagraphComponent,
    HeightCalculateComponent,
    StarRatingComponent,
  ],
  host: {
    '[class]': 'getReaderViewModeClass()',
  },
})
export class BookCanvasComponent implements OnDestroy {
  private el = inject(ElementRef);
  private domHelper = inject(DomHelperService);

  @Input() set book(book: Signal<Book | null>) {
    this.textIndexMapperService.setParagraphs(book()?.paragraphs || []);
    this._book = book;
  }
  get book(): Signal<Book | null> {
    return this._book;
  }
  @Output() paragraphClick = new EventEmitter<number>();
  @ViewChild('scrollViewport') viewport!: CdkVirtualScrollViewport;

  public textIndexMapperService = inject(TextIndexMapperService);

  private _book!: Signal<Book | null>;

  public heightCalculated(delta: HeightDelta) {
    setupViewportScrollerService(
      this.el,
      this.viewport,
      delta,
      this.bookData!.paragraphs,
      this.destroyed$
    );

    this.domHelper.showActiveParagraph();
  }

  public coverSrc = computed(() => {
    const src = this.book()?.cover?.toBase64String();
    return src ?? DEFAULT_COVER_SRC;
  });

  public trackByFn(index: number, item: string): string {
    return item;
  }

  public getTextIndex(index: number): number {
    return this.textIndexMapperService.getTextIndex(index);
  }

  public get bookData(): Book | null {
    return this.book();
  }

  public onParagraphClick(index: number): void {
    this.paragraphClick.emit(index);
  }

  protected getReaderViewModeClass(): string {
    return (
      localStorage.getItem('readerViewMode') || DefaultSettings.readerViewMode
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  private destroyed$: Subject<void> = new Subject<void>();
  protected readonly BOOK_IMAGE_WIDTH = BOOK_IMAGE_WIDTH;
  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
  protected readonly Boolean = Boolean;
}
