import { Injectable, OnDestroy } from '@angular/core';
import { PARAGRAPH_CLASS_PREFIX } from '@book-play/constants';
import { debounce } from 'lodash';
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
  public scrolled$?: Observable<Event>;
  private scrollingStopped$: Subject<void> = new Subject();

  constructor(
    private cursorService: CursorPositionLocalStorageService,
    private scrollPositionHelper: ScrollPositionHelperService
  ) {}

  private attachScrollingEvent() {
    if (viewportScroller) {
      if (this.scrolled$) {
        this.scrollingStopped$.next();
      }

      this.scrolled$ = viewportScroller.scrolled$;
      this.scrolled$
        ?.pipe(
          takeUntil(this.scrollingStopped$),
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

  public showActiveParagraph = debounce(
    async (index = this.cursorService.position) => {
      await firstValueFrom(timer(100));

      let node = this.getParagraphNode(index);

      if (viewportScroller && !node) {
        await this.scrollPositionHelper.scrollToIndex(index);
        await firstValueFrom(timer(100));

        node = this.getParagraphNode(index);
      }
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.updateActiveCSSClass(node as HTMLElement);
      }

      if (viewportScroller) {
        this.attachScrollingEvent(); // TODO: find a better place
      }
    },
    500
  );

  ngOnDestroy() {
    this.scrollingStopped$.next();
  }
}
