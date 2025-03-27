import { Pipe, PipeTransform } from '@angular/core';
import { GenrePipe } from './genre.pipe';

@Pipe({
  name: 'genres',
})
export class GenresPipe implements PipeTransform {
  private genrePipe = new GenrePipe(); // injection is not working here

  transform(genres: string[]): string {
    return genres.map((genre) => this.genrePipe.transform(genre)).join(', ');
  }
}
