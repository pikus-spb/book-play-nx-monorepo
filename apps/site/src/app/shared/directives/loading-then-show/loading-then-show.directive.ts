import {
  ComponentRef,
  contentChild,
  Directive,
  effect,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AppEventNames, EventsStateService } from '@book-play/services';
import { LoadingIndicatorComponent } from '../../components/loading-indicator/loading-indicator.component';

@Directive({
  selector: '[loading]',
})
export class LoadingThenShowDirective {
  @Input() thenShow?: TemplateRef<unknown>;

  private placeHolder = contentChild('loading', {
    read: ViewContainerRef,
  });
  private loadingComponentRef?: ComponentRef<LoadingIndicatorComponent>;
  private embeddedViewRef?: EmbeddedViewRef<unknown>;

  constructor(
    private eventStates: EventsStateService,
    private viewContainerRef: ViewContainerRef
  ) {
    effect(() => {
      const viewContainerRef = this.placeHolder() || this.viewContainerRef;
      if (this.eventStates.get(AppEventNames.loading)()) {
        this.loadingComponentRef = viewContainerRef.createComponent(
          LoadingIndicatorComponent
        );
      } else {
        this.loadingComponentRef?.destroy();
      }

      if (this.thenShow) {
        if (this.eventStates.get(AppEventNames.loading)()) {
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
