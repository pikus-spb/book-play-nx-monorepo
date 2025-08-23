import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { setDocumentBookTitleWithContext } from '@book-play/utils-browser';
import { map } from 'rxjs';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'lib-book-page',
  imports: [BookCardComponent],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  protected book = toSignal(this.route.data.pipe(map((data) => data['book'])));

  ngOnInit() {
    const book = this.book();
    if (book !== null) {
      setDocumentBookTitleWithContext(book.full);
    }
  }
}
