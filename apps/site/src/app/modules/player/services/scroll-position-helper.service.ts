import { Injectable } from '@angular/core';
import { viewportScroller } from 'app/modules/player/services/viewport-scroller.service';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionHelperService {
  constructor(private eventStateService: EventsStateService) {}

  public async scrollToIndex(cursorIndex: number): Promise<void> {
    if (viewportScroller) {
      this.eventStateService.add(AppEventNames.scrollingIntoView);
      await viewportScroller.scrollToIndex(cursorIndex);
      this.eventStateService.remove(AppEventNames.scrollingIntoView);
    }
  }
}
