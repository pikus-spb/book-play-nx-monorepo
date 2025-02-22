import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ElementRef } from '@angular/core';
import { first, firstValueFrom, Observable, tap, timer } from 'rxjs';
import { HeightDelta } from '../model/delta';

export let viewportScroller: null | ViewportScrollerService = null;

class ViewportScrollerService {
  public scrolled$!: Observable<Event>;

  constructor(
    private el: ElementRef | undefined,
    private viewport: CdkVirtualScrollViewport | undefined,
    private defaultElementTag: string,
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
    const paragraph = this.el?.nativeElement.querySelector(
      `${this.defaultElementTag}:nth-of-type(${index})`
    );
    if (paragraph) {
      paragraph.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
    if (this.viewport) {
      const range = this.viewport.getRenderedRange();
      if (index >= range.start && index <= range.end) {
        this.scrollToFoundParagraph(index - range.start);
      } else {
        if (index < range.start) {
          guessOffset = this.scrollToOffset(guessOffset, -1);
        } else if (index > range.end) {
          guessOffset = this.scrollToOffset(guessOffset, 1);
        }

        await firstValueFrom(timer(1));
        await this.adjustOffset(index, guessOffset);
      }
    }
  }

  public async scrollToIndex(index: number): Promise<void> {
    if (this.viewport) {
      let guessOffset = 0;
      this.paragraphs.slice(0, index).forEach((p) => {
        const rowsNum = Math.ceil(p.length / this.delta.length);
        guessOffset += rowsNum * this.delta.height + this.delta.margin;
      });

      this.viewport.scrollToOffset(Math.round(guessOffset), 'instant');

      await firstValueFrom(timer(1));
      await this.adjustOffset(index, guessOffset);
    }
  }
}

export function setupViewportScrollerService(
  el: ElementRef | undefined,
  viewport: CdkVirtualScrollViewport | undefined,
  defaultElementTag: string,
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
      defaultElementTag,
      delta,
      paragraphs,
      destroy$
    );
  }
}
