import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AuthorCardComponent } from '../author-card/author-card.component';

@Component({
  selector: 'lib-author-page',
  imports: [AuthorCardComponent],
  templateUrl: './author-page.component.html',
  styleUrl: './author-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorPageComponent {
  private route = inject(ActivatedRoute);
  protected author = toSignal(
    this.route.data.pipe(map((data) => data['author']))
  );
}
