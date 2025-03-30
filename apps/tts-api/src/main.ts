import {
  CORS_ALLOWED_LIST,
  TTS_API_PORT,
  TTS_API_PORT_SECURE,
} from '@book-play/constants';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import * as https from 'node:https';
import path from 'path';
import BooksAPIApp from './app';

const privateKey = fs.readFileSync(
  '/etc/letsencrypt/live/book-play.ru/name.key',
  'utf8'
);
const certificate = fs.readFileSync(
  '/etc/letsencrypt/live/book-play.ru/name.crt',
  'utf8'
);
const credentials = { key: privateKey, cert: certificate };

const expressApp = express();

function corsOptionsDelegate(req, callback) {
  if (CORS_ALLOWED_LIST.indexOf(req.header('Origin')) >= 0) {
    callback(null, { origin: true }); // reflect (enable) the requested origin in the CORS response
  } else {
    callback(null, { origin: false }); // disable CORS for this request
  }
}

expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());

const httpServer = http.createServer(expressApp);
const httpsServer = https.createServer(credentials, expressApp);

const app = new BooksAPIApp();

httpServer.listen(TTS_API_PORT, () => {
  console.log(`Web server is listening on port ${TTS_API_PORT}`);
});

httpsServer.listen(TTS_API_PORT_SECURE, () => {
  console.log(`Web server is listening on port ${TTS_API_PORT_SECURE}`);
});

expressApp.post(
  '/tts',
  cors(corsOptionsDelegate),
  (req: express.Request, res: express.Response) => {
    app.tts(req.body, req).then((file) => {
      const filePath = path.join(file);
      const stat = fs.statSync(filePath);

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
      });

      const readStream = fs.createReadStream(filePath);

      readStream.pipe(res);

      setTimeout(() => {
        fs.unlinkSync(filePath);
      }, 1000);
    });
  }
);
