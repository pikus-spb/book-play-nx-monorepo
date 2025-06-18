import { Injectable, inject } from '@angular/core';
import { AppEventNames, EventsStateService } from '../events-state.service';
import { viewportScroller } from './viewport-scroller.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionHelperService {
  private eventStateService = inject(EventsStateService);

  public async scrollToIndex(cursorIndex: number): Promise<void> {
    if (viewportScroller) {
      this.eventStateService.add(AppEventNames.scrollingIntoView);
      await viewportScroller.scrollToIndex(cursorIndex);
      this.eventStateService.remove(AppEventNames.scrollingIntoView);
    }
  }
}
