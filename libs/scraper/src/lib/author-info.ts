const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

import { AuthorInfo } from '../';

export async function searchAuthor(
  firstName: string,
  lastName: string
): Promise<AuthorInfo | undefined> {
  const query = firstName + ' ' + lastName;
  // Prevent blocking via random timer
  const randomSleepAmount = Math.round(Math.random() * 200);
  await new Promise((resolve) =>
    setTimeout(() => resolve(true), randomSleepAmount)
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Prevent blocking via random user agent
  const userAgent = randomUseragent.getRandom();
  await page.setUserAgent(userAgent);

  const searchAuthorInfoUrl = `https://www.litres.ru/search/authors/?q=${encodeURIComponent(
    query
  )}`;
  try {
    await page.goto(searchAuthorInfoUrl, { waitUntil: 'domcontentloaded' });
  } catch (e) {
    console.error(e);
  }

  const linkData = await page.evaluate(() => {
    const link: HTMLAnchorElement = document.querySelector(
      'a[data-testid=search__personName]'
    );
    if (link !== null) {
      return {
        title: link.innerText.trim(),
        url: link.href + 'about',
      };
    }
  });
  let authorInfo;

  if (linkData) {
    const correctAuthorCheck = new RegExp(
      query.split(' ').join('.+') + '$',
      'ig'
    ).test(linkData.title);

    if (correctAuthorCheck) {
      const searchAuthorInfoUrl = linkData.url;
      await page.goto(searchAuthorInfoUrl, { waitUntil: 'domcontentloaded' });

      authorInfo = await page.evaluate(() => {
        const img: HTMLImageElement = document.querySelector(
          'div[data-testid=author__wrapper] > div > div > div > img'
        );
        const imageUrl =
          img.src.toLowerCase().indexOf('nophoto') === -1 ? img.src : '';
        const data: HTMLElement = document.querySelector(
          'div[data-testid=author__wrapper] > div:last-child > div >' +
            ' div > div'
        );

        let about = '';
        // Check there is any data
        if (
          data !== null &&
          (data.firstChild as HTMLElement).tagName.toLowerCase() !== 'a'
        ) {
          about = data.innerText;
          // Remove litres data
          about = about
            .split('\n')
            .filter((line) => line.toLowerCase().indexOf('литрес') === -1)
            .join('\n');
        }

        return { imageUrl, about };
      });
    }
  }

  await browser.close();
  return authorInfo;
}
