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
  }

  public async finalize() {
    await this.browser.close();
  }

  public async searchBook(query: string): Promise<BookInfo | undefined> {
    // Prevent blocking via random user agent
    await this.page.setUserAgent(randomUseragent.getRandom());
    const searchBookInfoUrl = `https://fantlab.ru/searchmain?searchstr=${encodeURIComponent(
      query
    )}`;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, Math.round(Math.random() * 5000));
    });

    try {
      await this.page.goto(searchBookInfoUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }

    const linkUrl = await this.page.evaluate(() => {
      const link: HTMLAnchorElement = document.querySelector('div.title > a');
      if (link) {
        return link.href;
      }
    });

    let bookInfo;
    if (linkUrl) {
      try {
        await this.page.goto(linkUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 10000,
        });
      } catch (e) {
        console.error(e);
        return;
      }

      bookInfo = await this.page.evaluate(() => {
        const span: HTMLSpanElement = document.querySelector(
          'div.rating-block-body dl span[itemprop="ratingValue"]'
        );

        let rating;

        if (span) {
          rating = parseFloat(span.innerText);
        }

        return { rating };
      });
    }

    return bookInfo;
  }
}
