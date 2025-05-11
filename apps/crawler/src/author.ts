import { DBAuthor } from '@book-play/models';
import { searchAuthor } from '@book-play/scraper';

export async function addAdditionalDataToAuthor(
  dbAuthor: DBAuthor
): Promise<DBAuthor> {
  const authorInfo = await searchAuthor(dbAuthor.first, dbAuthor.last);

  if (authorInfo) {
    dbAuthor.image = authorInfo.imageUrl || '';
    dbAuthor.about = authorInfo.about || '';
  }

  return dbAuthor;
}
