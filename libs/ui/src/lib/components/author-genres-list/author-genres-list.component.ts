import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { Genre } from '@book-play/models';
import { GenrePipe } from '../../pipes/genre/genre.pipe';

@Component({
  selector: 'lib-author-genres-list',
  imports: [GenrePipe, MatChipSet, MatChip, RouterLink],
  templateUrl: './author-genres-list.component.html',
  styleUrl: './author-genres-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorGenresListComponent {
  public genres = input<Genre[]>();
  public linkPrefix = input<string>('/advanced-search/genres=');
}
