import { BOOKS_API_PORT, BOOKS_API_PORT_SECURE } from '@book-play/constants';
import { AdvancedSearchParams, BookData } from '@book-play/models';
import { log } from '@book-play/utils-common';
import cors from 'cors';
import { environment } from 'environments/environment.ts';
import express from 'express';
import fs from 'fs';
import http from 'http';
import * as https from 'node:https';
import BooksAPIApp from './app';

log('\n\n\n');
log('=================================');
log('Starting....');

const privateKey = fs.readFileSync(environment.HTTPS_PRIVATE_KEY, 'utf8');
const certificate = fs.readFileSync(environment.HTTPS_CERTIFICATE, 'utf8');
const credentials = { key: privateKey, cert: certificate };
log('Acquired certificate...');

const expressApp = express();
log('Run Express...');

function corsOptionsDelegate(req, callback): void {
  if (environment.CORS_ALLOWED_LIST.indexOf(req.header('Origin')) >= 0) {
    callback(null, { origin: true }); // reflect (enable) the requested origin in the CORS response
  } else {
    callback(null, { origin: false }); // disable CORS for this request
  }
}
log('Setup CORS...' + JSON.stringify(environment.CORS_ALLOWED_LIST));

const httpServer = http.createServer(expressApp);
log('Starting httpServer on ' + BOOKS_API_PORT);

const httpsServer = https.createServer(credentials, expressApp);
log('Starting httpsServer on ' + BOOKS_API_PORT_SECURE);

const app = new BooksAPIApp();
log('Running BooksAPIApp...');

httpServer.listen(BOOKS_API_PORT, () => {
  log(`Started server successfully on port ${BOOKS_API_PORT}.`);
});
httpsServer.listen(BOOKS_API_PORT_SECURE, () => {
  log(`Started server successfully on port ${BOOKS_API_PORT_SECURE}.`);
});

expressApp.get(
  '/author/id/:id/summary',
  cors(corsOptionsDelegate),
  (req, res) => {
    log('GET: /author/id/:id/summary ' + JSON.stringify(req.params));
    const id = req.params.id;
    app
      .authorSummary(id)
      .then((books) => {
        res.json(books);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

expressApp.get(
  '/author/random/:number?',
  cors(corsOptionsDelegate),
  (req, res) => {
    log('GET: /author/random/:number? ' + JSON.stringify(req.params));
    const number = req.params.number;
    app
      .randomAuthors(number)
      .then((authors) => {
        res.json(authors);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

expressApp.get(
  '/author/id/:id/books',
  cors(corsOptionsDelegate),
  (req, res) => {
    log('GET: /author/id/:id/books ' + JSON.stringify(req.params));
    const id = req.params.id;
    app
      .authorBooks(id)
      .then((book) => {
        res.json(book);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

expressApp.get(
  '/book/id/:id',
  cors(corsOptionsDelegate),
  (req: express.Request, res: express.Response) => {
    log('GET: /book/id/:id ' + JSON.stringify(req.params));
    const id = req.params.id;
    app
      .bookById(id)
      .then((book) => {
        res.json(book);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);
expressApp.get(
  '/book/id/:id/summary',
  cors(corsOptionsDelegate),
  (req, res) => {
    log('GET: /book/id/:id/summary ' + JSON.stringify(req.params));
    const id = req.params.id;
    app
      .bookSummaryById(id)
      .then((book) => {
        res.json(book);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);
expressApp.get(
  '/book/random-id/:number?',
  cors(corsOptionsDelegate),
  (req, res) => {
    log('GET: /book/random-id/:number? ' + JSON.stringify(req.params));
    const number = req.params.number;
    app
      .randomBookIds(number)
      .then((ids) => {
        res.json(ids);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

expressApp.get('/book/search/:query', cors(corsOptionsDelegate), (req, res) => {
  log('GET: /book/search/:query ' + JSON.stringify(req.params));
  const query = req.params.query;
  app
    .bookSearch(query)
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.json(err);
    });
});

expressApp.get(
  '/book/advanced-search',
  cors(corsOptionsDelegate),
  (req, res) => {
    log('GET: /book/advanced-search ' + JSON.stringify(req.query));
    const genres = req.query['genres'] as string;
    const params: AdvancedSearchParams = {
      genres: genres.length > 0 ? genres.split(',') : [],
      rating: Number(req.query['rating']),
    };
    app
      .advancedSearch(params)
      .then((books: BookData[]) => {
        res.json(books.sort((a, b) => a.full.localeCompare(b.full)));
      })
      .catch((err) => {
        res.json(err);
      });
  }
);
