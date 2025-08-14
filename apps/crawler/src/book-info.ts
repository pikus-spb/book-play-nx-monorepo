import { DBBook } from '@book-play/models';
import { BookInfo, SearchBook } from '@book-play/scraper';
import { error, log } from '@book-play/utils-common';

export async function addAdditionalDataToBook(
  scrapper: SearchBook,
  dbBook: DBBook
): Promise<DBBook> {
  let bookInfo: BookInfo;
  for (let i = 0; i < 3; i++) {
    try {
      log('Searching book on fantlib...');
      bookInfo = await scrapper.searchBook(dbBook.full);
    } catch (err) {
      error(err);
      log('Reinit browser and retry...');
      await scrapper.finalize();
      await scrapper.init();
      continue;
    }

    break;
  }

  log(JSON.stringify(bookInfo));

  if (!bookInfo || !bookInfo.rating) {
    bookInfo = {
      rating: 0,
    };
  }
  dbBook.rating = bookInfo.rating;

  return dbBook;
}
