import {
  CORS_OPTIONS,
  environment,
  TTS_API_PORT,
  TTS_API_PORT_SECURE,
} from '@book-play/constants';
import { TtsParams, Voices } from '@book-play/models';
import { error, log } from '@book-play/utils-common';
import { isAbortError } from '@book-play/utils-node';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import * as https from 'node:https';
import EdgeTtsApp from './edge.tts.app.ts';
import F5TtsApp from './f5.tts.app';
import GoogleTtsApp from './google.tts.app';
import PiperTtsApp from './piper.tts.app.ts';

const privateKey = fs.readFileSync(environment.HTTPS_PRIVATE_KEY, 'utf8');
const certificate = fs.readFileSync(environment.HTTPS_CERTIFICATE, 'utf8');
const credentials = { key: privateKey, cert: certificate };

log('\n\n\n');
log('Starting TTS API...');
log('Acquired certificate...');
log('Run Express...');
log('CORS options: ' + JSON.stringify(CORS_OPTIONS));

const expressApp = express();
expressApp.use(cors(CORS_OPTIONS));

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

expressApp.post('/tts', async (req: express.Request, res: express.Response) => {
  const params = req.body as TtsParams;
  const abortController = new AbortController();
  const abortRequest = () => {
    if (!res.writableEnded && !abortController.signal.aborted) {
      log('HTTP request cancelled');
      abortController.abort();
    }
  };

  req.once('aborted', abortRequest);
  res.once('close', abortRequest);

  let mp3Data = null;
  try {
    if (params.voice === Voices.Vasilisa) {
      mp3Data = await new GoogleTtsApp().runTts(
        params,
        abortController.signal
      );
    } else if (params.voice === Voices.F5) {
      mp3Data = await new F5TtsApp().runTts(params, abortController.signal);
    } else if (
      [Voices.Irina, Voices.Tamara, Voices.Kirill].includes(params.voice)
    ) {
      mp3Data = await new PiperTtsApp().runTts(params, abortController.signal);
    } else if ([Voices.Dmitry, Voices.Svetlana].includes(params.voice)) {
      mp3Data = await new EdgeTtsApp().runTts(params, abortController.signal);
    } else {
      params.voice = Voices.Dmitry;
      mp3Data = await new EdgeTtsApp().runTts(params, abortController.signal);
    }
  } catch (e) {
    if (isAbortError(e) || abortController.signal.aborted) {
      return;
    }

    error(e);
    res.status(500).send({
      message: String(e),
    });
    return;
  }

  if (mp3Data !== null) {
    if (abortController.signal.aborted) {
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', mp3Data.size);

    const buffer = await mp3Data.arrayBuffer();
    if (!abortController.signal.aborted) {
      res.end(Buffer.from(buffer));
    }
  }
});
