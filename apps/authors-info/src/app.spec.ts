import { searchAuthor } from '@book-play/scraper';
import { PoolOptions } from 'mysql2';
import { run } from './app'; // Укажите правильный путь к вашему модулю

jest.mock('@book-play/scraper', () => ({
  searchAuthor: jest.fn(),
}));

jest.mock('mysql2', () => ({
  createPool: jest.fn((options: PoolOptions) => ({
    query: jest.fn((query, callback1, callback2) => {
      const callback = callback2 ?? callback1;
      if (query.startsWith('INSERT INTO authors')) {
        callback(null, { insertId: 1 });
      } else if (query.startsWith('SELECT first, last FROM authors')) {
        callback(null, [['John', 'Doe']]);
      } else {
        callback(new Error('Query not mocked'));
      }
    }),
  })),
}));

describe('run function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch authors, filter them, and search info about', async () => {
    const mockAuthors = [
      ['Jane', 'Austen'],
      ['John', 'Doe'], // Уже в базе
    ];

    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockAuthors) })
    );
    (searchAuthor as jest.Mock).mockResolvedValue({
      about: 'Famous author',
      imageUrl: 'http://example.com/jane.jpg',
    });

    await run();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/author/all')
    );
    expect(searchAuthor).toHaveBeenCalledWith('Jane', 'Austen');
  });

  it('should handle cases where no new authors need to be searched info about', async () => {
    const mockAuthors = [['John', 'Doe']];
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockAuthors) })
    );

    await run();
    expect(searchAuthor).not.toHaveBeenCalled();
  });
});
