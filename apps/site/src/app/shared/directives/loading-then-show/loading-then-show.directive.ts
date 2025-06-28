import {
  ComponentRef,
  contentChild,
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { LoadingIndicatorComponent } from '../../components/loading-indicator/loading-indicator.component';
import { selectLoading } from '../../store/loading/loading.selector';

@Directive({
  selector: '[loading]',
})
export class LoadingThenShowDirective {
  @Input() thenShow?: TemplateRef<unknown>;
  private viewContainerRef = inject(ViewContainerRef);
  private store = inject(Store);
  private loading = toSignal(this.store.select(selectLoading));
  private placeHolder = contentChild('loading', {
    read: ViewContainerRef,
  });
  private loadingComponentRef?: ComponentRef<LoadingIndicatorComponent>;
  private embeddedViewRef?: EmbeddedViewRef<unknown>;

  constructor() {
    effect(() => {
      const viewContainerRef = this.placeHolder() || this.viewContainerRef;
      if (this.loading()) {
        this.loadingComponentRef = viewContainerRef.createComponent(
          LoadingIndicatorComponent
        );
      } else {
        this.loadingComponentRef?.destroy();
      }

      if (this.thenShow) {
        if (this.loading()) {
          this.embeddedViewRef?.destroy();
        } else {
          this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(
            this.thenShow
          );
        }
      }
    });
  }
}
