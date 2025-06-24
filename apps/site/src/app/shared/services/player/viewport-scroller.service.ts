import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ElementRef } from '@angular/core';
import { BOOK_IMAGE_HEIGHT, BOOK_IMAGE_MARGIN } from '@book-play/constants';
import { filterTextParagraphs } from '@book-play/models';
import { HeightDelta } from '@book-play/ui';
import { getParagraphNode } from '@book-play/utils-browser';
import { first, firstValueFrom, Observable, tap, timer } from 'rxjs';

export let viewportScroller: null | ViewportScrollerService = null;

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
          viewportScroller = null;
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

  private async adjustOffset(index: number, guessOffset: number) {
    const shownParagraphs = Array.from(
      this.el?.nativeElement.querySelectorAll('book-paragraph > p')
    );
    const firstParagraph = shownParagraphs[0] as HTMLElement;
    const lastParagraph = shownParagraphs.slice(-1)[0] as HTMLElement;

    if (firstParagraph && lastParagraph) {
      const start = Number(
        firstParagraph.className.match(/book-paragraph-(\d+)$/)?.[1]
      );
      const end = Number(
        lastParagraph.className.match(/book-paragraph-(\d+)$/)?.[1]
      );

      if (index >= start && index <= end) {
        this.scrollToFoundParagraph(index);
      } else {
        if (index < start) {
          guessOffset = this.scrollToOffset(guessOffset, -1);
        } else if (index > end) {
          guessOffset = this.scrollToOffset(guessOffset, 1);
        }

        await firstValueFrom(timer(1));
        await this.adjustOffset(index, guessOffset);
      }
    } else {
      await firstValueFrom(timer(1));
      await this.adjustOffset(index, guessOffset);
    }
  }

  public async scrollToIndex(index: number): Promise<void> {
    if (this.viewport) {
      let guessOffset = 0;

      const paragraphs = this.paragraphs.slice(0, index);
      const textParagraphs = filterTextParagraphs(paragraphs);

      textParagraphs.forEach((p) => {
        const rowsNum = Math.ceil(p.length / this.delta.length);
        guessOffset += rowsNum * this.delta.height + this.delta.margin;
      });

      const imagesNumber = paragraphs.length - textParagraphs.length;

      guessOffset += IMAGE_DELTA * imagesNumber;

      this.viewport.scrollToOffset(Math.round(guessOffset), 'instant');

      await firstValueFrom(timer(1));
      await this.adjustOffset(index, guessOffset);
    }
  }
}

export function setupViewportScrollerService(
  el: ElementRef | undefined,
  viewport: CdkVirtualScrollViewport | undefined,
  delta: HeightDelta,
  paragraphs: string[],
  destroy$: Observable<void>
) {
  if (viewportScroller !== null) {
    viewportScroller.delta = delta;
  } else {
    viewportScroller = new ViewportScrollerService(
      el,
      viewport,
      delta,
      paragraphs,
      destroy$
    );
  }
}
