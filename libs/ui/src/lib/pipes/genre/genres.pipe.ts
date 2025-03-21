import { Pipe, PipeTransform } from '@angular/core';
import { FB2_GENRES } from '@book-play/constants';

@Pipe({
  name: 'genres',
})
export class GenresPipe implements PipeTransform {
  transform(genres: string[]): string {
    return genres.map((genre) => FB2_GENRES[genre]).join(', ');
  }
}
