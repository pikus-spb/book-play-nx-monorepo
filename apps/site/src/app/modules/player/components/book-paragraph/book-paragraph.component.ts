import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export const PARAGRAPH_CLASS_PREFIX = 'book-paragraph-';

@Component({
  selector: 'book-paragraph',
  standalone: true,
  templateUrl: './book-paragraph.component.html',
  styleUrls: ['./book-paragraph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookParagraphComponent {
  @Input() text = '';
  @Input() index!: number;
  public PARAGRAPH_CLASS_PREFIX = PARAGRAPH_CLASS_PREFIX;
}
