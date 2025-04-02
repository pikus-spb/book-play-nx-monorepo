import { Injectable, OnDestroy } from '@angular/core';
import { PARAGRAPH_CLASS_PREFIX } from '@book-play/constants';
import {
  firstValueFrom,
  Observable,
  Subject,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { CursorPositionLocalStorageService } from './cursor-position-local-storage.service';
import { ScrollPositionHelperService } from './scroll-position-helper.service';
import { viewportScroller } from './viewport-scroller.service';

@Injectable({
  providedIn: 'root',
})
export class DomHelperService implements OnDestroy {
  public viewportScrolled$?: Observable<Event>;
  private viewportScrolledDestroy$: Subject<void> = new Subject();

  constructor(
    private cursorService: CursorPositionLocalStorageService,
    private scrollPositionHelper: ScrollPositionHelperService
  ) {}

  private updateActiveParagraphCSSOnScroll() {
    if (viewportScroller) {
      // Delete previous subscription
      if (this.viewportScrolled$) {
        this.viewportScrolledDestroy$.next();
      }

      this.viewportScrolled$ = viewportScroller.scrolled$;
      this.viewportScrolled$
        ?.pipe(
          takeUntil(this.viewportScrolledDestroy$),
          tap(() => {
            const node = this.getParagraphNode(this.cursorService.position);
            this.updateActiveCSSClass(node);
          })
        )
        .subscribe();
    }
  }

  public updateActiveCSSClass(element: HTMLElement | null): void {
    document.body.querySelector('p.active')?.classList.remove('active');
    element?.classList.add('active');
  }

  public getParagraphNode(index: number): HTMLElement | null {
    return document.body.querySelector(`.${PARAGRAPH_CLASS_PREFIX}${index}`);
  }

  public showActiveParagraph = async (index = this.cursorService.position) => {
    await firstValueFrom(timer(1));

    const node = this.getParagraphNode(index);

    if (node) {
      node.scrollIntoView({ block: 'center' });
      this.updateActiveCSSClass(node as HTMLElement);
    } else {
      await this.scrollPositionHelper.scrollToIndex(index);
    }

    if (viewportScroller) {
      this.updateActiveParagraphCSSOnScroll();
    }
  };

  ngOnDestroy() {
    this.viewportScrolledDestroy$.next();
  }
}
