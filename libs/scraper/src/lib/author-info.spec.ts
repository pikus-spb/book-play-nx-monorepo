const puppeteer = require('puppeteer');
import { searchAuthor } from '../';

jest.mock('puppeteer');

describe('searchAuthor', () => {
  let browserMock, pageMock;

  beforeEach(() => {
    pageMock = {
      newPage: jest.fn().mockResolvedValue({}),
      setUserAgent: jest.fn().mockResolvedValue(''),
      goto: jest.fn().mockResolvedValue(''),
      evaluate: jest.fn(),
    };
    browserMock = {
      newPage: jest.fn().mockResolvedValue(pageMock),
      close: jest.fn().mockResolvedValue(''),
    };

    puppeteer.launch = jest.fn().mockResolvedValue(browserMock);
  });

  it('should return author info when author is found', async () => {
    pageMock.evaluate
      .mockResolvedValueOnce({
        title: 'John Doe',
        url: 'https://www.litres.ru/john-doe/about',
      })
      .mockResolvedValueOnce({
        imageUrl: 'https://example.com/john-doe.jpg',
        about: 'John Doe is a famous author.',
      });

    const result = await searchAuthor('John', 'Doe');
    expect(result).toEqual({
      imageUrl: 'https://example.com/john-doe.jpg',
      about: 'John Doe is a famous author.',
    });
    expect(puppeteer.launch).toHaveBeenCalled();
    expect(browserMock.newPage).toHaveBeenCalled();
    expect(pageMock.setUserAgent).toHaveBeenCalled();
    expect(pageMock.goto).toHaveBeenCalledTimes(2);
    expect(browserMock.close).toHaveBeenCalled();
  });

  it('should return undefined when author is not found', async () => {
    pageMock.evaluate.mockResolvedValueOnce({
      title: 'Williams Doe',
      url: 'https://www.litres.ru/will-doe/about',
    });
    const result = await searchAuthor('John', 'Doe');
    expect(result).toBeUndefined();
    expect(browserMock.close).toHaveBeenCalled();
  });
});
