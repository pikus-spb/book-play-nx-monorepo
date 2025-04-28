import { DBAuthorByGenre, GenreAuthor } from './author';

export function DBAuthorByGenreToUI(input: DBAuthorByGenre): GenreAuthor {
  return {
    id: input.id,
    full: input.full,
    genres: JSON.parse(input.genres || '[]'),
  };
}
