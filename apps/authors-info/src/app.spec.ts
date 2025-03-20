import { searchAuthor } from '@book-play/scraper';
import { run } from './app'; // Укажите правильный путь к вашему модулю

jest.mock('@book-play/scraper', () => ({
  searchAuthor: jest.fn(),
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
