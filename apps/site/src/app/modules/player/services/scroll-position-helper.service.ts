import { Injectable } from '@angular/core';
import { ActiveBookService } from 'app/modules/player/services/active-book.service';
import { CursorPositionLocalStorageService } from 'app/modules/player/services/cursor-position-local-storage.service';
import { viewportScroller } from 'app/modules/player/services/viewport-scroller.service';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionHelperService {
  constructor(
    private eventStateService: EventsStateService,
    private cursorService: CursorPositionLocalStorageService,
    private openedBook: ActiveBookService
  ) {}

  public cursorPositionIsValid(): boolean {
    const book = this.openedBook.book();
    if (book !== null) {
      return this.cursorService.position < book.paragraphs.length;
    }
    return false;
  }

  public async scrollToIndex(cursorIndex: number): Promise<void> {
    if (viewportScroller) {
      this.eventStateService.add(AppEventNames.scrollingIntoView);
      await viewportScroller.scrollToIndex(cursorIndex);
      this.eventStateService.remove(AppEventNames.scrollingIntoView);
    }
  }
}
