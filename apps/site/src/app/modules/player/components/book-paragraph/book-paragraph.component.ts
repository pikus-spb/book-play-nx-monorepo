import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BOOK_IMAGE_HEIGHT,
  PARAGRAPH_CLASS_PREFIX,
} from '@book-play/constants';
import { ImageBase64Data } from '@book-play/models';
import { isTextParagraph } from '@book-play/utils-browser';
import { CursorPositionService } from '../../../../shared/services/player/cursor-position.service';

@Component({
  selector: 'book-paragraph',
  templateUrl: './book-paragraph.component.html',
  styleUrls: ['./book-paragraph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class BookParagraphComponent {
  public index = input.required<number>();
  @Input() text = '';
  @Output() activated = new EventEmitter<number>();

  protected PARAGRAPH_CLASS_PREFIX = PARAGRAPH_CLASS_PREFIX;

  protected isActive = computed(() => {
    return this.cursorPosition() === this.index();
  });

  private cursorPositionService = inject(CursorPositionService);
  private cursorPosition = toSignal(this.cursorPositionService.position$);

  public toBase64String(text: string): string {
    return new ImageBase64Data(JSON.parse(text)).toBase64String();
  }

  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly isTextParagraph = isTextParagraph;
}
