import {
  ComponentRef,
  contentChild,
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  Input,
  linkedSignal,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectLoading } from '@book-play/store';
import { Store } from '@ngrx/store';
import { LoadingIndicatorComponent } from '../../components/loading-indicator/loading-indicator.component';

@Directive({
  selector: '[loading]',
})
export class LoadingThenShowDirective implements OnInit, OnDestroy {
  @Input() thenShow?: TemplateRef<unknown>;
  private viewContainerRef = inject(ViewContainerRef);
  private store = inject(Store);
  private loading = toSignal(this.store.select(selectLoading));
  private placeHolder = contentChild('loading', {
    read: ViewContainerRef,
  });
  private loadingComponentRef?: ComponentRef<LoadingIndicatorComponent>;
  private viewContainerRefActual = linkedSignal(
    () => this.placeHolder() || this.viewContainerRef
  );
  private embeddedViewRef?: EmbeddedViewRef<unknown>;

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.loadingComponentRef?.instance.show();
      } else {
        this.loadingComponentRef?.instance.hide();
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

  public ngOnInit() {
    this.loadingComponentRef = this.viewContainerRefActual().createComponent(
      LoadingIndicatorComponent
    );
  }

  public ngOnDestroy() {
    this.loadingComponentRef?.destroy();
  }
}
