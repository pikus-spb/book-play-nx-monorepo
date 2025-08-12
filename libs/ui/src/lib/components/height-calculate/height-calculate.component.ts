import {
  Component,
  ComponentRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewContainerRef,
} from '@angular/core';
import { HeightDelta } from '@book-play/models';
import { CalculateComponent } from './calculate.component';

@Component({
  selector: 'lib-height-calculate',
  template: '',
})
export class HeightCalculateComponent implements OnInit, OnDestroy {
  public resizable = input.required<HTMLDivElement>();
  public done = output<HeightDelta>();
  private child: ComponentRef<CalculateComponent> | null = null;
  private vcr = inject(ViewContainerRef);

  public ngOnInit() {
    this.child = this.vcr.createComponent(CalculateComponent);

    const resizeObserver = new ResizeObserver(async () => {
      const heightDelta = await this.child?.instance.calculate();
      if (heightDelta) {
        this.done.emit(heightDelta);
      }
    });
    resizeObserver.observe(this.resizable());
  }

  public ngOnDestroy() {
    this.child?.destroy();
    this.child = null;
  }
}
