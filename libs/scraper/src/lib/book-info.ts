import { log } from '@book-play/utils-common';
import { randomSleep } from '@book-play/utils-node';
import { environment } from 'environments/environment';
import { Browser, Page } from 'puppeteer';
import { BookInfo } from '../';

const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

export class SearchBook {
  private browser!: Browser;
  private page!: Page;

  public async init() {
    this.browser = await puppeteer.launch({
      executablePath: environment.chromeExecutablePath,
      headless: true,
      args: ['--no-sandbox'],
    });
    this.page = await this.browser.newPage();
    log('Init Chrome OK...');
  }

  public async finalize() {
    await this.browser.close();
    log('Closed Chrome');
  }

  public async searchBook(query: string): Promise<BookInfo | undefined> {
    // Prevent blocking via random timer
    await randomSleep(7000);
    // Prevent blocking via random user agent
    const userAgent = randomUseragent.getRandom();

    await this.page.setUserAgent(userAgent);
    const searchBookInfoUrl = `https://fantlab.ru/searchmain?searchstr=${encodeURIComponent(
      query
    )}`;

    log(searchBookInfoUrl);

    try {
      await this.page.goto(searchBookInfoUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 2000,
      });
    } catch (e) {
      return Promise.reject(e);
    }

    const linkUrl = await this.page.evaluate(() => {
      const link: HTMLAnchorElement = document.querySelector('div.title > a');
      if (link) {
        return link.href;
      }
    });

    log(linkUrl);

    let bookInfo: BookInfo = {
      rating: 0,
      annotation: null,
    };
    if (linkUrl) {
      try {
        await this.page.goto(linkUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 2000,
        });
      } catch (e) {
        return Promise.reject(e);
      }

      try {
        bookInfo = await this.page.evaluate(() => {
          let rating = 0;
          let span: HTMLSpanElement | null = document.querySelector(
            'div.rating-block-body dl span[itemprop="ratingValue"]'
          );
          if (span !== null) {
            rating = parseFloat(span.innerText);
          }

          let annotation = null;
          span = document.querySelector('#annotation-unit .responses-list');
          if (span !== null) {
            annotation = span.innerText;
          }

          return { rating, annotation };
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return bookInfo;
  }
}
