import { environment } from './environment';

// HTTP
export const BOOKS_API_PORT = 8282;
export const BOOKS_API_PORT_SECURE = 8443;
export const TTS_API_PORT = 8181;
export const TTS_API_PORT_SECURE = 8143;
export const UNBLOCK_CONTENT_COOKIE_NAME = 'unblock.cookie.password';
export const UNBLOCK_HEADER_NAME = 'X-Unblock-Token';
export const CORS_OPTIONS = {
  origin: environment.CORS_ALLOWED_LIST,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', UNBLOCK_HEADER_NAME],
  preflightContinue: true,
};
// LIBRARY
export const PARAGRAPH_CLASS_PREFIX = 'book-p-';
// SITE
export const DEFAULT_COUNTDOWN_TIMER_VALUE = 60 * 60 * 1.5;
export const MAX_BOOK_SCROLL_ADJUSTMENTS = 2000;
export const DEFAULT_COVER_SRC = '/assets/images/empty-cover.jpg';
export const BOOK_IMAGE_WIDTH = 200;
export const BOOK_IMAGE_HEIGHT = 300;
export const BOOK_IMAGE_MARGIN = 32;
export const NOT_AVAILABLE = 'н/д';
// Заголовки
export const BLOCKED_BOOK_TEXT =
  'Книга была удалена по требованию правообладателя (но вы все еще можете прослушать её на сайте, самостоятельно купив и загрузив в плеер)';
export const DEFAULT_TITLE_PREFIX = 'Book-play.ru';
export const VOICE_PAGE_TITLE = [
  'Озвучить произвольный текст с помощью нейронной сети',
  DEFAULT_TITLE_PREFIX,
].join(' - ');
export const RIGHTHOLDERS_PAGE_TITLE = [
  'Для правообладателей',
  DEFAULT_TITLE_PREFIX,
].join(' - ');
export const NOT_FOUND_PAGE_TITLE = [
  'Страница не найдена',
  DEFAULT_TITLE_PREFIX,
].join(' - ');
export const SETTINGS_PAGE_TITLE = [
  'Настройки сайта',
  DEFAULT_TITLE_PREFIX,
].join(' - ');
export const EMPTY_CONTEXT =
  'бесплатная платформа для прослушивания книг, озвученных нейросетью.';
export const BOOK_SEARCH_TITLE_CONTEXT =
  'Искать книги по автору или названию в бибиотеке';
export const ADVANCED_BOOK_SEARCH_TITLE = [
  'Расширенный поиск книг в бибиотеке - по жанру или рейтингу',
  DEFAULT_TITLE_PREFIX,
].join(' - ');
export const AUTHOR_TITLE_CONTEXT = 'слушать все произведения автора';
export const BOOK_TITLE_CONTEXT = 'бесплатно слушать книгу онлайн';
export const DEFAULT_TITLE = [DEFAULT_TITLE_PREFIX, EMPTY_CONTEXT].join(' - ');
export const SETTINGS_VOICE_RATE_DELTA = 20;
export const SETTINGS_VOICE_PITCH_DELTA = 15;
// BOOKS CRAWLER
export const MAX_IMAGE_DATA_LENGTH = 1000000;
// TTS API
export const YANDEX_TTS_API_URL = 'https://tts.voicetech.yandex.net/generate';
export const YANDEX_TTS_API_DEFAULT_OPTIONS = Object.freeze({
  key: '069b6659-984b-4c5f-880e-aaedcfd84102',
  format: 'mp3',
  lang: 'ru-RU',
  speed: '1.0',
  emotion: 'neutral',
  quality: 'hi',
  speaker: 'ermil',
});
export const VOICE_CACHE_PRELOAD_EXTRA = Object.freeze({
  min: 0,
  default: 10,
  max: 50,
});
export const MAX_BOOK_SEARCH_RESULTS = 1000;
