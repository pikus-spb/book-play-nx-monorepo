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
export const COVER_IMG_WIDTH = 200;
export const COVER_IMG_HEIGHT = 300;
export const DEFAULT_TITLE_PREFIX = 'Book-play.ru';
export const DEFAULT_EMPTY_CONTEXT =
  'Бесплатное проигрывание книг голосом в формате fb2 онлайн';
export const DEFAULT_TITLE_CONTEXT = 'бесплатно слушать аудиокнигу онлайн';
export const DEFAULT_TITLE = [DEFAULT_TITLE_PREFIX, DEFAULT_EMPTY_CONTEXT].join(
  ' - '
);

// BOOKS CRAWLER
export const LOGO_MAX_LENGTH = 1000000;
