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
      this.addScrollBarStyles();
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

  private addScrollBarStyles(): void {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(`
      .ps .ps__rail-y:hover,
      .ps .ps__rail-y:focus,
      .ps .ps__rail-y.ps--clicking,
      .ps .ps__rail-x:hover,
      .ps .ps__rail-x:focus,
      .ps .ps__rail-x.ps--clicking {
        background-color: rgba(0, 0, 0, 0.1);
      }
      .ps .ps__rail-y .ps__thumb-y,
      .ps .ps__rail-y .ps__thumb-x,
      .ps .ps__rail-x .ps__thumb-y,
      .ps .ps__rail-x .ps__thumb-x {
        background-color: rgba(0, 0, 0, 0.8);
      }
      .ps .ps__rail-y .ps__thumb-y,
      .ps .ps__rail-x .ps__thumb-y {
        background-color: rgba(0, 0, 0, 0.8);
        width: 11px;
      }
      .ps .ps__rail-y .ps__thumb-x,
      .ps .ps__rail-x .ps__thumb-x {
        background-color: rgba(0, 0, 0, 0.8);
        height: 11px;
      }
    `);
    document.adoptedStyleSheets = [stylesheet];
  }
}
