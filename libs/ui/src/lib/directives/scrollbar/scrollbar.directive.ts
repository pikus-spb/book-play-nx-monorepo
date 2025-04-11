import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

const MIN_HEIGHT = 25;
const SKIP_PX_OVERSIZE = 5;

@Directive({
  selector: '[libPerfectScrollbar]',
})
export class ScrollbarDirective implements AfterViewInit {
  public minHeight: InputSignal<number> = input(0);
  public suppressScrollX: InputSignal<boolean> = input(true);
  public suppressScrollY: InputSignal<boolean> = input(false);
  private el: ElementRef = inject(ElementRef);
  private ps: PerfectScrollbar | null = null;

  public ngAfterViewInit(): void {
    if (this.el?.nativeElement && this.ps === null) {
      this.createScrollBar();
      this.addResizeListener();
    }
  }

  private onResize(): void {
    this.ps?.update();
  }

  private createScrollBar(): void {
    this.ps = new PerfectScrollbar(this.el.nativeElement, {
      minScrollbarLength: this.minHeight() || MIN_HEIGHT,
      scrollYMarginOffset: SKIP_PX_OVERSIZE,
      scrollXMarginOffset: SKIP_PX_OVERSIZE,
      suppressScrollX: this.suppressScrollX(),
      suppressScrollY: this.suppressScrollY(),
    });
  }

  private addResizeListener(): void {
    const observer = new ResizeObserver(() => {
      this.onResize();
    });
    observer.observe(this.el.nativeElement);
  }
}
