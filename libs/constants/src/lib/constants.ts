// HTTP
export const protocol = 'http:';
export const BOOKS_API_PORT = 8282;
export const TTS_API_PORT = 8181;
export const AUDIO_API_URL = 'http://192.168.31.200:8181/tts';
export const BOOKS_API_URL = protocol + '//192.168.31.200:' + BOOKS_API_PORT;
export const HTTP_RETRY_NUMBER = 3;
export const CORS_ALLOWED_LIST = [
  'http://localhost:4200',
  'http://192.168.31.200',
  'http://book-play.ru',
  'https://book-play.ru',
];
// LIBRARY
export const PARAGRAPH_CLASS_PREFIX = 'book-paragraph-';
// SITE
export const DEFAULT_COVER_SRC = '/assets/images/empty-cover.jpg';
export const BOOK_IMAGE_WIDTH = 274;
export const BOOK_IMAGE_HEIGHT = 400;
export const BOOK_IMAGE_MARGIN = 32;
export const DEFAULT_TITLE_PREFIX = 'Book-play.ru';
export const DEFAULT_EMPTY_CONTEXT =
  'Бесплатное проигрывание книг голосом в формате fb2 онлайн';
export const DEFAULT_TITLE_CONTEXT = 'бесплатно слушать аудиокнигу онлайн';
export const DEFAULT_TITLE = [DEFAULT_TITLE_PREFIX, DEFAULT_EMPTY_CONTEXT].join(
  ' - '
);
// BOOKS CRAWLER
export const MAX_IMAGE_DATA_LENGTH = 1000000;
export const BOOKS_JSON_PATH = '/home/petr/add-books/books-json/';
