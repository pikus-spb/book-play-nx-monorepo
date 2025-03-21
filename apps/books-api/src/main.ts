import { BOOKS_API_PORT, CORS_ALLOWED_LIST } from '@book-play/constants';
import cors from 'cors';
import express from 'express';
// import fs from 'fs';
import http from 'http';
// import https from 'https';
import BooksAPIApp from './app';

// const privateKey  = fs.readFileSync('/etc/letsencrypt/live/book-play.ru/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/book-play.ru/cert.pem', 'utf8');
// const credentials = {key: privateKey, cert: certificate};

const expressApp = express();

function corsOptionsDelegate(req, callback): void {
  if (CORS_ALLOWED_LIST.indexOf(req.header('Origin')) >= 0) {
    callback(null, { origin: true }); // reflect (enable) the requested origin in the CORS response
  } else {
    callback(null, { origin: false }); // disable CORS for this request
  }
}

const httpServer = http.createServer(expressApp);
// const httpsServer = https.createServer(credentials, expressApp);

const app = new BooksAPIApp();
// const HTTPS_APP_PORT = 8443;

httpServer.listen(BOOKS_API_PORT, () => {
  console.log(`Web server is listening on port ${BOOKS_API_PORT}`);
});
// httpsServer.listen(HTTPS_APP_PORT, () => {
//     console.log(`Web server is listening on port ${HTTPS_APP_PORT}`);
// });

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

expressApp.get(
  '/author/genre/:genre',
  cors(corsOptionsDelegate),
  (req, res) => {
    const genre = req.params.genre;
    app
      .authorsByGenre(genre)
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
    const number = req.params.number;
    app
      .randomAuthors(number)
      .then((book) => {
        res.json(book);
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
