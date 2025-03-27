import { Pipe, PipeTransform } from '@angular/core';
import { FB2_GENRES } from '@book-play/constants';

@Pipe({
  name: 'genre',
})
export class GenrePipe implements PipeTransform {
  transform(genre: string): string {
    return FB2_GENRES[genre] ? FB2_GENRES[genre] : genre;
  }
}
