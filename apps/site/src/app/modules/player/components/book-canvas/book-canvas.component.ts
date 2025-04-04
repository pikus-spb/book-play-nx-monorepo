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
  HostListener,
  Input,
  OnDestroy,
  Output,
  Signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BOOK_IMAGE_HEIGHT,
  BOOK_IMAGE_WIDTH,
  DEFAULT_COVER_SRC,
} from '@book-play/constants';
import { Book } from '@book-play/models';
import { HeightCalculateComponent, HeightDelta } from '@book-play/ui';
import {
  isTextParagraph,
  showDefaultCoverImage,
} from '@book-play/utils-browser';

import PerfectScrollbar from 'perfect-scrollbar';
import { Subject } from 'rxjs';
import { DomHelperService } from '../../../../shared/services/dom-helper.service';
import { setupViewportScrollerService } from '../../../../shared/services/viewport-scroller.service';
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
    RouterLink,
  ],
})
export class BookCanvasComponent implements OnDestroy {
  @Input() set book(book: Signal<Book | null>) {
    const paragraphs = book()?.paragraphs;
    let textIndex = 0;
    this.textIndexes = {};

    paragraphs?.forEach((p, index) => {
      this.textIndexes[index] = textIndex;

      if (isTextParagraph(p)) {
        textIndex++;
      }
    });

    this._book = book;
  }
  get book(): Signal<Book | null> {
    return this._book;
  }

  @Output() paragraphClick: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('scrollViewport') viewport!: CdkVirtualScrollViewport;
  @ViewChild('scrollable') scrollable?: ElementRef;

  private _book!: Signal<Book | null>;
  private textIndexes: Record<number, number> = {};
  private ps: PerfectScrollbar | null = null;

  constructor(private el: ElementRef, private domHelper: DomHelperService) {}

  @HostListener('window:resize')
  onResize() {
    this.ps?.update();
  }

  public heightCalculated(delta: HeightDelta) {
    setupViewportScrollerService(
      this.el,
      this.viewport,
      delta,
      this.bookData!.paragraphs,
      this.destroyed$
    );

    if (this.scrollable?.nativeElement && this.ps === null) {
      this.ps = new PerfectScrollbar(this.scrollable.nativeElement, {
        minScrollbarLength: 25,
        suppressScrollX: true,
      });
    }

    this.domHelper.showActiveParagraph();
  }

  public coverSrc = computed(() => {
    const src = this.book()?.cover?.toBase64String();
    return src ?? DEFAULT_COVER_SRC;
  });

  public trackByFn(index: number, item: string): string {
    return item;
  }

  public toTextIndex(index: number): number {
    return this.textIndexes[index];
  }

  public get bookData(): Book | null {
    return this.book();
  }

  public onParagraphClick(index: number): void {
    this.paragraphClick.emit(index);
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  private destroyed$: Subject<void> = new Subject<void>();
  protected readonly BOOK_IMAGE_WIDTH = BOOK_IMAGE_WIDTH;
  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
}
