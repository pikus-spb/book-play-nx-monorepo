// HTTP
export const protocol = document.location.protocol;
const BOOKS_API_PORT = protocol === 'https:' ? 8443 : 8282;
export const AUDIO_API_URL = 'http://192.168.31.200:8181/tts';
export const BOOKS_API_URL = protocol + '//192.168.31.200:' + BOOKS_API_PORT;
export const HTTP_RETRY_NUMBER = 3;

// LIBRARY
export const PARAGRAPH_CLASS_PREFIX = 'book-paragraph-';

// SITE
export const DEFAULT_TITLE_PREFIX = 'Book-play.ru';
export const DEFAULT_EMPTY_CONTEXT =
  'Бесплатное проигрывание книг в формате fb2 онлайн';
export const DEFAULT_TITLE_CONTEXT = 'бесплатно слушать аудиокнигу онлайн';
export const DEFAULT_TITLE = `${DEFAULT_TITLE_PREFIX} - ${DEFAULT_EMPTY_CONTEXT}`;
