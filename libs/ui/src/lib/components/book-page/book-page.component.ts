import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'lib-book-page',
  imports: [BookCardComponent],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPageComponent {
  private route = inject(ActivatedRoute);
  protected book = toSignal(this.route.data.pipe(map((data) => data['book'])));
}
