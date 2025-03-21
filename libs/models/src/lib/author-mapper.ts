import { AuthorByGenre, DBAuthorByGenre } from './author';

export function DBAuthorByGenreToUI(input: DBAuthorByGenre): AuthorByGenre {
  return {
    id: input.id,
    full: input.full,
    genres: JSON.parse(input.genres || '[]'),
  };
}
