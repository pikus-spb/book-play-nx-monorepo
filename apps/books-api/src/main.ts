import { BOOKS_API_PORT, BOOKS_API_PORT_SECURE } from '@book-play/constants';
import cors from 'cors';
import { environment } from 'environments/environment.ts';
import express from 'express';
import fs from 'fs';
import http from 'http';
import * as https from 'node:https';
import BooksAPIApp from './app';

const privateKey = fs.readFileSync(environment.HTTPS_PRIVATE_KEY, 'utf8');
const certificate = fs.readFileSync(environment.HTTPS_CERTIFICATE, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const expressApp = express();

function corsOptionsDelegate(req, callback): void {
  if (environment.CORS_ALLOWED_LIST.indexOf(req.header('Origin')) >= 0) {
    callback(null, { origin: true }); // reflect (enable) the requested origin in the CORS response
  } else {
    callback(null, { origin: false }); // disable CORS for this request
  }
}

const httpServer = http.createServer(expressApp);
const httpsServer = https.createServer(credentials, expressApp);

const app = new BooksAPIApp();

httpServer.listen(BOOKS_API_PORT, () => {
  console.log(`Web server is listening on port ${BOOKS_API_PORT}`);
});
httpsServer.listen(BOOKS_API_PORT_SECURE, () => {
  console.log(`Web server is listening on port ${BOOKS_API_PORT_SECURE}`);
});

expressApp.get('/author/all', cors(corsOptionsDelegate), (req, res) => {
  app
    .authors()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.json(err);
    });
});

expressApp.get(
  '/author/id/:id/summary',
  cors(corsOptionsDelegate),
  (req, res) => {
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

expressApp.get('/book/search/:query', cors(corsOptionsDelegate), (req, res) => {
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
  '/author/random/:number?',
  cors(corsOptionsDelegate),
  (req, res) => {
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
