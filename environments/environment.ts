export const environment = {
  // HTTP
  API_HOST: 'book-play.ru',
  CORS_ALLOWED_LIST: ['http://book-play.ru', 'https://book-play.ru'],
  // SITE
  HTTPS_PRIVATE_KEY: '/etc/letsencrypt/live/book-play.ru/privkey.pem',
  HTTPS_CERTIFICATE: '/etc/letsencrypt/live/book-play.ru/cert.pem',
  // BOOKS CRAWLER
  BOOKS_JSON_PATH: '/root/add-books/books-json/',
  DB_CONFIG: Object.freeze({
    connectionLimit: 20,
    connectTimeout: 60000,
    host: '81.90.181.235',
    port: '3306',
    user: 'root',
    password: '1414',
    database: 'books',
  }),
};
