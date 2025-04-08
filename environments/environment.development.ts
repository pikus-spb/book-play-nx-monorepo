export const environment = {
  // HTTP
  API_HOST: '192.168.31.200',
  CORS_ALLOWED_LIST: [
    'http://localhost:4200',
    'http://192.168.31.200',
    'https://192.168.31.200',
  ],
  // SITE
  HTTPS_PRIVATE_KEY: '/etc/letsencrypt/live/book-play.ru/name.key',
  HTTPS_CERTIFICATE: '/etc/letsencrypt/live/book-play.ru/name.crt',
  BOOKS_JSON_PATH: '/home/petr/add-books/books-json/',
  DB_CONFIG: Object.freeze({
    connectionLimit: 20,
    connectTimeout: 60000,
    host: '192.168.31.200',
    port: '3306',
    user: 'petr',
    password: '1414',
    database: 'books',
  }),
};
