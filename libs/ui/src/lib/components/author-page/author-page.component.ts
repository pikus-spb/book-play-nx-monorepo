import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  DEFAULT_AUTHOR_TITLE_CONTEXT,
  DEFAULT_TITLE_PREFIX,
} from '@book-play/constants';
import { setWindowTitle } from '@book-play/utils-browser';
import { map } from 'rxjs';
import { AuthorCardComponent } from '../author-card/author-card.component';

@Component({
  selector: 'lib-author-page',
  imports: [AuthorCardComponent],
  templateUrl: './author-page.component.html',
  styleUrl: './author-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  protected author = toSignal(
    this.route.data.pipe(map((data) => data['author']))
  );

  ngOnInit() {
    const author = this.author();
    if (author !== null) {
      const title = [
        author.full,
        DEFAULT_AUTHOR_TITLE_CONTEXT,
        DEFAULT_TITLE_PREFIX,
      ];
      setWindowTitle(title.join(' - '));
    }
  }
}
