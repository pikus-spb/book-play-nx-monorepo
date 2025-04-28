import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipSet } from '@angular/material/chips';
import { Genre } from '@book-play/models';
import { GenrePipe } from '../../pipes/genre/genre.pipe';
import { TagLinkComponent } from '../tag-link/tag-link.component';

@Component({
  selector: 'lib-author-genres-list',
  imports: [GenrePipe, MatChipSet, TagLinkComponent],
  templateUrl: './author-genres-list.component.html',
  styleUrl: './author-genres-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorGenresListComponent {
  public genres = input<Genre[]>();
  public linkPrefix = input<string>('/author/genre');
}
