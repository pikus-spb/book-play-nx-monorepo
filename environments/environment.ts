export const environment = {
  production: true,
  // HTTP
  API_HOST: 'book-play.ru',
  CORS_ALLOWED_LIST: [
    'http://book-play.ru',
    'https://book-play.ru',
    'http://176.99.67.42',
    'https://176.99.67.42',
  ],
  // SITE
  HTTPS_PRIVATE_KEY: '/etc/letsencrypt/live/book-play.ru/privkey.pem',
  HTTPS_CERTIFICATE: '/etc/letsencrypt/live/book-play.ru/cert.pem',
  // BOOKS CRAWLER
  BOOKS_JSON_PATH: '/root/add-books/books-json/',
  DB_CONFIG: Object.freeze({
    connectionLimit: 20,
    connectTimeout: 60000,
    host: '176.99.67.42',
    port: '3306',
    user: 'bookplay',
    password: 'Gremlin10Ekib725',
    database: 'books',
  }),
  RANDOM_AUTHORS_COUNT: 3,
  RANDOM_BOOKS_COUNT: 3,
  // SCRAPER
  chromeExecutablePath: '/usr/bin/google-chrome',
  // PIPER TTS API
  PIPER_TTS_PATH: '/var/piper',
};
