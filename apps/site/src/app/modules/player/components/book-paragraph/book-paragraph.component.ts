import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  BOOK_IMAGE_HEIGHT,
  PARAGRAPH_CLASS_PREFIX,
} from '@book-play/constants';
import { ImageBase64Data } from '@book-play/models';
import { isTextParagraph } from '@book-play/utils-browser';

@Component({
  selector: 'book-paragraph',
  templateUrl: './book-paragraph.component.html',
  styleUrls: ['./book-paragraph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookParagraphComponent {
  @Input() text = '';
  @Input() index!: number;
  @Output() activated = new EventEmitter<number>();
  public PARAGRAPH_CLASS_PREFIX = PARAGRAPH_CLASS_PREFIX;

  public toBase64String(text: string): string {
    return new ImageBase64Data(JSON.parse(text)).toBase64String();
  }

  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly isTextParagraph = isTextParagraph;
}
