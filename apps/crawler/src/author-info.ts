import { DBAuthor } from '@book-play/models';
import { searchAuthor } from '@book-play/scraper';
import { log } from '@book-play/utils-common';

export async function addAdditionalDataToAuthor(
  dbAuthor: DBAuthor
): Promise<DBAuthor> {
  const authorInfo = await searchAuthor(dbAuthor.first, dbAuthor.last);

  log(JSON.stringify(authorInfo));

  if (authorInfo) {
    dbAuthor.image = authorInfo.imageUrl || '';
    dbAuthor.about = authorInfo.about || '';
  }

  return dbAuthor;
}
