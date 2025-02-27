import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PARAGRAPH_CLASS_PREFIX } from '@book-play/constants';

@Component({
  selector: 'book-paragraph',
  templateUrl: './book-paragraph.component.html',
  styleUrls: ['./book-paragraph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookParagraphComponent {
  @Input() text = '';
  @Input() index!: number;
  public PARAGRAPH_CLASS_PREFIX = PARAGRAPH_CLASS_PREFIX;
}
