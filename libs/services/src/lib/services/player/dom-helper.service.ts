import { Injectable, OnDestroy, inject } from '@angular/core';
import { PARAGRAPH_CLASS_PREFIX } from '@book-play/constants';
import { Subject } from 'rxjs';
import { CursorPositionService } from './cursor-position.service';
import { ScrollPositionHelperService } from './scroll-position-helper.service';

@Injectable({
  providedIn: 'root',
})
export class DomHelperService implements OnDestroy {
  private cursorService = inject(CursorPositionService);
  private scrollPositionHelper = inject(ScrollPositionHelperService);

  private viewportScrolledDestroy$: Subject<void> = new Subject();

  public getParagraphNode(index: number): HTMLElement | null {
    return document.body.querySelector(`.${PARAGRAPH_CLASS_PREFIX}${index}`);
  }

  public showActiveParagraph = async (index = this.cursorService.position) => {
    const node = this.getParagraphNode(index);
    if (node) {
      node.scrollIntoView({ block: 'center' });
    } else {
      await this.scrollPositionHelper.scrollToIndex(index);
    }
  };

  ngOnDestroy() {
    this.viewportScrolledDestroy$.next();
  }
}
