import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import {
  AfterViewInit,
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

import { Subject } from 'rxjs';
import { MaterialModule } from 'app/core/modules/material.module';
import { BookParagraphComponent } from 'app/modules/player/components/book-paragraph/book-paragraph.component';
import { createViewportScrollerService } from 'app/modules/player/services/viewport-scroller.service';
import { BookData } from 'app/shared/model/fb2-book.types';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';

import { CanvasSkeletonComponent } from '../canvas-skeleton/canvas-skeleton.component';

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
    CanvasSkeletonComponent,
  ],
})
export class BookCanvasComponent implements AfterViewInit, OnDestroy {
  @Input() book!: Signal<BookData | null>;
  @Output() paragraphClick: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('scrollViewport') viewport!: CdkVirtualScrollViewport;

  public scrolling: Signal<boolean>;

  constructor(private el: ElementRef, public eventState: EventsStateService) {
    this.scrolling = this.eventState.get(AppEventNames.scrollingIntoView);
  }

  public trackByFn(index: number, item: string): string {
    return item;
  }

  public get bookData(): BookData | null {
    return this.book();
  }

  public onParagraphClick(index: number): void {
    this.paragraphClick.emit(index);
  }

  ngAfterViewInit() {
    createViewportScrollerService(
      this.el,
      this.viewport,
      PARAGRAPH_TAG,
      this.destroyed$
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  private destroyed$: Subject<void> = new Subject<void>();
}
