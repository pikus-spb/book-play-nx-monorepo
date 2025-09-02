import { TTS_API_PORT, TTS_API_PORT_SECURE } from '@book-play/constants';
import { TtsParams, Voices } from '@book-play/models';
import { error, log } from '@book-play/utils-common';
import bodyParser from 'body-parser';
import cors from 'cors';
import { environment } from 'environments/environment.ts';
import express from 'express';
import fs from 'fs';
import http from 'http';
import * as https from 'node:https';
import EdgeTtsApp from './edge.tts.app.ts';
import PiperTtsApp from './piper.tts.app.ts';
import YandexTtsApp from './yandex.tts.app.ts';

const privateKey = fs.readFileSync(environment.HTTPS_PRIVATE_KEY, 'utf8');
const certificate = fs.readFileSync(environment.HTTPS_CERTIFICATE, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const expressApp = express();

log('\n\n\n');
log('Starting TTS API...');

function corsOptionsDelegate(req, callback) {
  if (environment.CORS_ALLOWED_LIST.indexOf(req.header('Origin')) >= 0) {
    callback(null, { origin: true }); // reflect (enable) the requested origin in the CORS response
  } else {
    callback(null, { origin: false }); // disable CORS for this request
  }
}

expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());

const httpServer = http.createServer(expressApp);
const httpsServer = https.createServer(credentials, expressApp);

httpServer.listen(TTS_API_PORT, () => {
  log(`Web server started and is listening port ${TTS_API_PORT}`);
});

httpsServer.listen(TTS_API_PORT_SECURE, () => {
  log(`Web server started and is listening port ${TTS_API_PORT_SECURE}`);
});

expressApp.post(
  '/tts',
  cors(corsOptionsDelegate),
  async (req: express.Request, res: express.Response) => {
    const params = req.body as TtsParams;

    let mp3Data = null;
    try {
      if (
        [Voices.Ermil, Voices.Jane, Voices.Omazh, Voices.Zahar].includes(
          params.voice
        )
      ) {
        mp3Data = await new YandexTtsApp().runTts(params);
      } else if (
        [Voices.Irina, Voices.Tamara, Voices.Kirill].includes(params.voice)
      ) {
        mp3Data = await new PiperTtsApp(req).runTts(params);
      } else if ([Voices.Dmitry, Voices.Svetlana].includes(params.voice)) {
        mp3Data = await new EdgeTtsApp().runTts(params);
      }
    } catch (e) {
      error(e);
      res.status(500).send({
        message: String(e),
      });
      return;
    }

    if (mp3Data !== null) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', mp3Data.size);

      mp3Data.arrayBuffer().then((buffer) => {
        res.end(Buffer.from(buffer));
      });
    }
  }
);
