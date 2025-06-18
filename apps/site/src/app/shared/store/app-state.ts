import { ActiveBookState } from './active-book/active-book.state';
import { AllAuthorsState } from './all-authors/all-authors.state';
import { AuthorBooksState } from './author-books/author-books.state';
import { AuthorSummaryState } from './author-summary/author-summary.state';
import { BookSearchState } from './book-search/book-search.state';
import { BookSummaryState } from './book-summary/book-summary.state';
import { LoadingState } from './loading/loading.state';
import { RandomAuthorSummaryState } from './random-author-details/random-author-summary.state';
import { RandomBooks } from './random-books/random-books';
import { SettingsState } from './settings/settings.state';
import { VoiceAudioState } from './voice-audio/voice-audio.state';

export interface AppState {
  loading: LoadingState;
  settings: SettingsState;
  voiceAudio: VoiceAudioState;
  activeBook: ActiveBookState;
  allAuthors: AllAuthorsState;
  randomAuthors: RandomAuthorSummaryState;
  randomBooks: RandomBooks;
  authorBooks: AuthorBooksState;
  authorSummary: AuthorSummaryState;
  bookSummary: BookSummaryState;
  bookSearch: BookSearchState;
}
