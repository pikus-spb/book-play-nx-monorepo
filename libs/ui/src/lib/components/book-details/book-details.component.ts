import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EmbeddedViewRef,
  inject,
  input,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { bookSummarySelector, loadBookSummaryAction } from '@book-play/store';
import { Store } from '@ngrx/store';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'a[libBookDetails]',
  imports: [BookCardComponent, MatIcon, MatIcon],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'onClick($event)',
  },
})
export class BookDetailsComponent {
  public bookId = input.required<string | undefined>();
  protected template = viewChild<TemplateRef<unknown>>('template');
  protected viewContainer = inject(ViewContainerRef);
  protected dialog = viewChild<ElementRef>('dialog');
  private store = inject(Store);
  private embeddedViewRef?: EmbeddedViewRef<unknown>;
  protected book = this.store.selectSignal(bookSummarySelector);

  protected onClick(event: Event) {
    const bookId = this.bookId();
    if (bookId) {
      this.store.dispatch(loadBookSummaryAction({ bookId }));

      const template = this.template();
      if (template) {
        this.embeddedViewRef = this.viewContainer.createEmbeddedView(template);
      }
      this.showDialog();
      event.preventDefault();
    }
  }

  protected stopEvent(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }

  protected closeDialog(): void {
    const dialog: HTMLDialogElement = this.dialog()?.nativeElement;
    if (dialog !== undefined) {
      dialog.close();
    }
    if (this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
    }
  }

  protected closeAndStopEvent(event: Event) {
    this.closeDialog();
    this.stopEvent(event);
  }

  private showDialog(): void {
    const dialog: HTMLDialogElement = this.dialog()?.nativeElement;
    if (dialog !== undefined) {
      dialog.showModal();
    }
  }
}
