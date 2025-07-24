import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthorSummary } from '@book-play/models';
import { AuthorGenresListComponent } from '@book-play/ui';
import { hideImage } from '@book-play/utils-browser';
import { map } from 'rxjs';

@Component({
  selector: 'author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AuthorGenresListComponent],
})
export class AuthorCardComponent {
  private route = inject(ActivatedRoute);
  public inputAuthor = input<AuthorSummary | null>(null, { alias: 'author' });
  private routeAuthor = toSignal(
    this.route.data.pipe(map((data) => data['author']))
  );
  protected authorSummary = computed<AuthorSummary | null>(() => {
    return this.inputAuthor() || this.routeAuthor();
  });

  protected readonly hideImage = hideImage;
}
