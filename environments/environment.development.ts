export const environment = {
  production: false,
  // HTTP
  API_HOST: '176.99.67.42',
  CORS_ALLOWED_LIST: [
    'http://book-play.ru',
    'https://book-play.ru',
    'http://localhost:4200',
    'http://192.168.31.200',
    'https://192.168.31.200',
    'http://176.99.67.42',
    'https://176.99.67.42',
  ],
  // SITE
  HTTPS_PRIVATE_KEY: '/home/petr/ssl/private.key',
  HTTPS_CERTIFICATE: '/home/petr/ssl/certificate.crt',
  BOOKS_JSON_PATH: '/home/petr/add-books/books-json/',
  DB_CONFIG: Object.freeze({
    connectionLimit: 20,
    connectTimeout: 60000,
    host: '192.168.31.200',
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
  PIPER_TTS_PATH: '/home/petr/piper',
};
