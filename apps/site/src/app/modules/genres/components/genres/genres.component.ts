import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FB2_GENRES, FB2_GENRES_KEYS_SORTED } from '@book-play/constants';
import { TagLinkComponent } from '@book-play/ui';

@Component({
  selector: 'genres',
  imports: [TagLinkComponent],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenresComponent {
  protected genres = FB2_GENRES_KEYS_SORTED;
  protected allGenres = FB2_GENRES;
}
