import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ElementRef } from '@angular/core';
import { first, firstValueFrom, Observable, tap, timer } from 'rxjs';

export let viewportScroller: null | ViewportScrollerService = null;

class ViewportScrollerService {
  public scrolled$!: Observable<Event>;

  constructor(
    private el: ElementRef | undefined,
    private viewport: CdkVirtualScrollViewport | undefined,
    private defaultElementTag: string,
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
      paragraph.scrollIntoView({ block: 'center' });
    }
  }

  private scrollToFirstParagraph() {
    const paragraph = this.el?.nativeElement.querySelector(
      `${this.defaultElementTag}`
    );
    if (paragraph) {
      paragraph.scrollIntoView({ block: 'end' });
    }
  }

  private scrollToLastParagraph() {
    const paragraphs = this.el?.nativeElement.querySelectorAll(
      `${this.defaultElementTag}`
    );
    if (paragraphs.length) {
      const paragraph = Array.from(paragraphs).slice(
        -1
      )[0] as HTMLParagraphElement;
      paragraph.scrollIntoView({ block: 'start' });
    }
  }

  private getOuterHeight(el: HTMLElement) {
    const styles = window.getComputedStyle(el);
    const margin =
      parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

    return Math.ceil(el.offsetHeight + margin);
  }

  private getItemHeight(): number {
    const paragraphs = this.el?.nativeElement.querySelectorAll(
      `${this.defaultElementTag}`
    );
    return (
      Array.from(paragraphs)
        .map((p) => this.getOuterHeight(p as HTMLElement))
        .reduce((memo, height) => {
          memo += height;
          return memo;
        }, 0) / paragraphs.length
    );
  }

  private async adjustOffset(index: number) {
    if (this.viewport) {
      const range = this.viewport.getRenderedRange();
      if (index >= range.start && index <= range.end) {
        this.scrollToFoundParagraph(index - range.start);
      } else {
        if (index <= range.start) {
          this.scrollToFirstParagraph();
        } else if (index >= range.end) {
          this.scrollToLastParagraph();
        }

        await firstValueFrom(timer(1));
        await this.adjustOffset(index);
      }
    }
  }

  public async scrollToIndex(index: number): Promise<void> {
    if (this.viewport) {
      const itemHeight = this.getItemHeight();
      const guessOffset = index * itemHeight;

      this.viewport.scrollToOffset(Math.round(guessOffset));
      await firstValueFrom(timer(300));

      await this.adjustOffset(index);
    }
  }
}

export function createViewportScrollerService(
  el: ElementRef | undefined,
  viewport: CdkVirtualScrollViewport | undefined,
  defaultElementTag: string,
  destroy$: Observable<void>
) {
  if (viewportScroller != null) {
    throw new Error('Multiple viewport scroller creation!');
  }
  viewportScroller = new ViewportScrollerService(
    el,
    viewport,
    defaultElementTag,
    destroy$
  );
}
