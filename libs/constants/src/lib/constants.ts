// HTTP
export const BOOKS_API_PORT = 8282;
export const BOOKS_API_PORT_SECURE = 8443;
export const TTS_API_PORT = 8181;
export const TTS_API_PORT_SECURE = 8143;
export const HTTP_RETRY_NUMBER = 3;
// LIBRARY
export const PARAGRAPH_CLASS_PREFIX = 'book-paragraph-';
// SITE
export const DEFAULT_COVER_SRC = '/assets/images/empty-cover.jpg';
export const BOOK_IMAGE_WIDTH = 200;
export const BOOK_IMAGE_HEIGHT = 300;
export const BOOK_IMAGE_MARGIN = 32;
export const DEFAULT_TITLE_PREFIX = 'Book-play.ru';
export const DEFAULT_EMPTY_CONTEXT =
  'бесплатная платформа для прослушивания книг, озвученных нейросетью.';
export const DEFAULT_TITLE_CONTEXT = 'бесплатно слушать книгу онлайн';
export const DEFAULT_TITLE = [DEFAULT_TITLE_PREFIX, DEFAULT_EMPTY_CONTEXT].join(
  ' - '
);
export const SETTINGS_VOICE_RATE_DELTA = 5;
export const SETTINGS_VOICE_PITCH_DELTA = 12;
// BOOKS CRAWLER
export const MAX_IMAGE_DATA_LENGTH = 1000000;
