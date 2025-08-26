import { inject, Injectable, OnDestroy } from '@angular/core';
import { PARAGRAPH_CLASS_PREFIX } from '@book-play/constants';
import { debounce } from 'lodash';
import { firstValueFrom, Subject } from 'rxjs';
import { AppEventNames, EventsStateService } from '../events-state.service';
import { CursorPositionService } from './cursor-position.service';
import { viewportScrollerService } from './viewport-scroller.service';

@Injectable({
  providedIn: 'root',
})
export class DomHelperService implements OnDestroy {
  private cursorService = inject(CursorPositionService);
  private eventsStateService = inject(EventsStateService);
  private viewportScrolledDestroy$: Subject<void> = new Subject();
  private forceStopScrollToIndex$ = new Subject<null>();

  public getParagraphNode(index: number): HTMLElement | null {
    return document.body.querySelector(`.${PARAGRAPH_CLASS_PREFIX}${index}`);
  }

  public showActiveParagraph = debounce(
    async (index = this.cursorService.position, force = false) => {
      if (document.hasFocus() || force) {
        const node = this.getParagraphNode(index);
        if (node) {
          node.scrollIntoView({ block: 'center' });
        } else {
          if (viewportScrollerService) {
            this.forceStopScrollToIndex$.next(null);
            this.eventsStateService.add(AppEventNames.scrollingIntoView);
            await firstValueFrom(
              viewportScrollerService.scrollToIndex(
                index,
                this.forceStopScrollToIndex$
              )
            );
            this.eventsStateService.remove(AppEventNames.scrollingIntoView);
          }
        }
      }
    },
    100
  );

  ngOnDestroy() {
    this.viewportScrolledDestroy$.next();
  }
}
