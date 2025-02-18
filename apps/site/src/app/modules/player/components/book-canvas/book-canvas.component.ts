import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Signal,
  ViewChild,
} from '@angular/core';
import { Book } from '@book-play/models';
import {
  DomHelperService,
  HeightCalculateComponent,
  HeightDelta,
  setupViewportScrollerService,
} from '@book-play/services';
import { Subject } from 'rxjs';
import { MaterialModule } from '../../../../core/modules/material.module';
import { BookParagraphComponent } from '../book-paragraph/book-paragraph.component';

const PARAGRAPH_TAG = 'book-paragraph';

@Component({
  selector: 'book-canvas',
  templateUrl: './book-canvas.component.html',
  styleUrls: ['./book-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    ScrollingModule,
    ExperimentalScrollingModule,
    BookParagraphComponent,
    HeightCalculateComponent,
  ],
})
export class BookCanvasComponent implements OnDestroy {
  @Input() book!: Signal<Book | null>;
  @Output() paragraphClick: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('scrollViewport') viewport!: CdkVirtualScrollViewport;

  constructor(private el: ElementRef, private domHelper: DomHelperService) {}

  public heightCalculated(delta: HeightDelta) {
    setupViewportScrollerService(
      this.el,
      this.viewport,
      PARAGRAPH_TAG,
      delta,
      this.bookData!.paragraphs,
      this.destroyed$
    );
    this.domHelper.showActiveParagraph();
  }

  public removeImage(event: Event): void {
    (event.target as HTMLImageElement).remove();
  }

  public trackByFn(index: number, item: string): string {
    return item;
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
}
