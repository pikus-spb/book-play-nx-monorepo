import { DB_CONFIG } from '@book-play/constants';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import express from 'express';
import mysql, { PoolOptions } from 'mysql2';

const pool = mysql.createPool(DB_CONFIG as unknown as PoolOptions);
const TMP_FILE_EXTENTION = '.tmp.mp3';
const MP3_FILE_EXTENTION = '.mp3';

export default class BooksAPIApp {
  loadFromDb(text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT fileName, used FROM audiocache WHERE text = "${text}"`,
        (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else if (result && result[0]) {
            const used = result[0].used + 1;
            pool.query(
              `UPDATE audiocache
                         SET used = ${used}
                         WHERE text = "${text}"`,
              (err2) => {
                if (err) {
                  console.error(err2);
                  reject(err);
                }
              }
            );
          }

          resolve(result && result[0]);
        }
      );
    });
  }

  saveToDb(text: string, fileName: string) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO audiocache (text, fileName, used) VALUES (?, ?, ?)',
        [text, fileName, 0],
        (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(fileName);
          }
        }
      );
    });
  }

  killOnClose(
    req: express.Request,
    precess: ChildProcessWithoutNullStreams,
    reject: () => void
  ) {
    req.connection.on('close', () => {
      try {
        process.kill(precess.pid, 9);
      } catch (e: unknown) {
        reject();
      }
      reject();
    });
  }

  runTts(
    text: string,
    fileName: string,
    req: express.Request
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      text = text.replace(/"/g, '\\"').replace(/\.\s*$/, '');
      const args = [
        '--voice',
        'ru-RU-DmitryNeural',
        '--pitch=-10Hz',
        '--rate',
        '+10%',
        '--write-media',
        fileName + TMP_FILE_EXTENTION,
        '--text',
        `"${text}"`,
      ];
      const ttsProc = spawn('edge-tts', args, { detached: true });

      this.killOnClose(req, ttsProc, reject);

      ttsProc.on('close', () => {
        const args = [
          fileName + TMP_FILE_EXTENTION,
          '-C',
          '48',
          fileName + MP3_FILE_EXTENTION,
          'silence',
          '-l',
          '1',
          '0.001',
          '1%',
          '-1',
          '0.6',
          '1%',
        ];
        const removeSilenceProc = spawn('sox', args, { detached: true });
        removeSilenceProc.on('close', () => {
          setTimeout(() => resolve(fileName + MP3_FILE_EXTENTION), 200);
        });
      });
    });
  }

  async tts(text: string, req: express.Request) {
    const loadResult = await this.loadFromDb(text);
    if (loadResult) {
      return loadResult.fileName;
    } else {
      const fileNamePrefix = __dirname + '/cache/part' + Date.now();
      try {
        const resultFileName = await this.runTts(text, fileNamePrefix, req);
        return this.saveToDb(text, resultFileName);
      } catch (e) {
        console.error(e);
        return '';
      }
    }
  }
}
