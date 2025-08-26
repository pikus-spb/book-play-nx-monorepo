import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ElementRef } from '@angular/core';
import {
  BOOK_IMAGE_HEIGHT,
  BOOK_IMAGE_MARGIN,
  MAX_BOOK_SCROLL_ADJUSTMENTS,
  PARAGRAPH_CLASS_PREFIX,
} from '@book-play/constants';
import { filterTextParagraphs, HeightDelta } from '@book-play/models';
import { getParagraphNode } from '@book-play/utils-browser';
import {
  first,
  Observable,
  of,
  race,
  Subject,
  switchMap,
  tap,
  timer,
} from 'rxjs';

export let viewportScrollerService: null | ViewportScrollerService = null;

const IMAGE_DELTA = BOOK_IMAGE_HEIGHT + BOOK_IMAGE_MARGIN;

class ViewportScrollerService {
  public scrolled$!: Observable<Event>;

  constructor(
    private el: ElementRef | undefined,
    private viewport: CdkVirtualScrollViewport | undefined,
    public delta: HeightDelta,
    private paragraphs: string[],
    private onDestroy$: Observable<void>
  ) {
    this.onDestroy$
      .pipe(
        first(),
        tap(() => {
          this.el = undefined;
          this.viewport = undefined;
          viewportScrollerService = null;
        })
      )
      .subscribe();

    if (this.viewport) {
      this.scrolled$ = this.viewport.scrollable.elementScrolled();
    }
  }

  private scrollToFoundParagraph(index: number) {
    const paragraph = getParagraphNode(this.el?.nativeElement, index);
    if (paragraph) {
      paragraph.scrollIntoView({ block: 'center' });
    }
  }

  private scrollToOffset(guessOffset: number, sign: -1 | 1): number {
    if (this.viewport) {
      const size = this.viewport.getViewportSize();
      guessOffset += size * sign;
      this.viewport.scrollToOffset(Math.round(guessOffset - size), 'instant');

      return guessOffset;
    }

    return 0;
  }

  private adjustOffset(
    index: number,
    guessOffset: number,
    iterationNumber: number,
    forceStopSubject$: Subject<null>
  ): Observable<null> {
    if (iterationNumber > MAX_BOOK_SCROLL_ADJUSTMENTS) {
      // Restart from the beginning because of too many adjustments
      return this.scrollToIndex(index, forceStopSubject$);
    }

    const shownParagraphs = Array.from(
      this.el?.nativeElement.querySelectorAll('book-paragraph > span.p')
    );
    const firstParagraph = shownParagraphs[0] as HTMLElement;
    const lastParagraph = shownParagraphs.slice(-1)[0] as HTMLElement;

    if (firstParagraph && lastParagraph) {
      const start = Number(
        firstParagraph.className.match(
          new RegExp(`${PARAGRAPH_CLASS_PREFIX}(\\d+)$`)
        )?.[1]
      );
      const end = Number(
        lastParagraph.className.match(
          new RegExp(`${PARAGRAPH_CLASS_PREFIX}(\\d+)$`)
        )?.[1]
      );

      if (index >= start && index <= end) {
        this.scrollToFoundParagraph(index);
        return of(null);
      } else {
        if (index < start) {
          guessOffset = this.scrollToOffset(guessOffset, -1);
        } else if (index > end) {
          guessOffset = this.scrollToOffset(guessOffset, 1);
        }

        return timer(1).pipe(
          switchMap(() =>
            this.adjustOffset(
              index,
              guessOffset,
              iterationNumber + 1,
              forceStopSubject$
            )
          )
        );
      }
    } else {
      return this.scrollToIndex(index, forceStopSubject$);
    }
  }

  public scrollToIndex(
    index: number,
    forceStopSubject$: Subject<null>
  ): Observable<null> {
    let guessOffset = 0;
    const paragraphs = this.paragraphs.slice(0, index);
    const textParagraphs = filterTextParagraphs(paragraphs);

    textParagraphs.forEach((p) => {
      const rowsNum = Math.ceil(p.length / this.delta.length);
      guessOffset += rowsNum * this.delta.height + this.delta.margin;
    });

    const imagesNumber = paragraphs.length - textParagraphs.length;

    guessOffset += IMAGE_DELTA * imagesNumber;

    this.viewport?.scrollToOffset(Math.round(guessOffset), 'instant');

    return timer(1).pipe(
      switchMap(() => {
        return race(
          this.adjustOffset(index, guessOffset, 0, forceStopSubject$),
          forceStopSubject$
        );
      })
    );
  }
}

export function setupViewportScrollerService(
  el: ElementRef | undefined,
  viewport: CdkVirtualScrollViewport | undefined,
  delta: HeightDelta,
  paragraphs: string[],
  destroy$: Observable<void>
) {
  if (viewportScrollerService !== null) {
    viewportScrollerService.delta = delta;
  } else {
    viewportScrollerService = new ViewportScrollerService(
      el,
      viewport,
      delta,
      paragraphs,
      destroy$
    );
  }
}
