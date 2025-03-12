const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

import { AuthorInfo } from '../model/author-info';

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
  console.log('Opening litres site...');
  await page.goto(searchAuthorInfoUrl, { waitUntil: 'domcontentloaded' });

  console.log('Getting link url...');
  const linkData = await page.evaluate(() => {
    const link: HTMLAnchorElement = document.querySelector(
      'a[data-testid=search__personName]'
    );
    return {
      title: link.innerText.trim(),
      url: link.href + 'about',
    };
  });
  console.log('Found: ' + linkData.title);
  console.log(linkData.title + ': ' + linkData.url);

  const correctAuthorCheck = new RegExp(
    query.split(' ').join('.+') + '$',
    'ig'
  ).test(linkData.title);

  let authorInfo;
  if (correctAuthorCheck) {
    console.log('Getting author data...');

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
        data &&
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

    console.log('Success!\n');
  } else {
    console.log('Author not found ' + query);
  }

  await browser.close();
  return authorInfo;
}
