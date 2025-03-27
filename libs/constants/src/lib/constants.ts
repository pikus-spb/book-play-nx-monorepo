// HTTP
export const API_HOST = '192.168.31.200';
export const BOOKS_API_PORT = 8282;
export const BOOKS_API_PORT_SECURE = 8443;
export const TTS_API_PORT = 8181;
export const TTS_API_PORT_SECURE = 8143;
export const HTTP_RETRY_NUMBER = 3;
export const CORS_ALLOWED_LIST = [
  'http://localhost:4200',
  'http://192.168.31.200',
  'https://192.168.31.200',
  'http://book-play.ru',
  'https://book-play.ru',
];
// LIBRARY
export const PARAGRAPH_CLASS_PREFIX = 'book-paragraph-';
// SITE
export const DEFAULT_COVER_SRC = '/assets/images/empty-cover.jpg';
export const BOOK_IMAGE_WIDTH = 200;
export const BOOK_IMAGE_HEIGHT = 300;
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
