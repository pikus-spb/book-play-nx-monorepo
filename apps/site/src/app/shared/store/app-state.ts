import { ActiveBookState } from './active-book/active-book.state';
import { AllAuthorsState } from './all-authors/all-authors.state';
import { AuthorBooksState } from './author-books/author-books.state';
import { AuthorSummaryState } from './author-summary/author-summary.state';
import { BookSummaryState } from './book-summary/book-summary.state';
import { GenreAuthorsState } from './genre-authors/genre-authors.state';
import { LoadingState } from './loading/loading.state';
import { RandomAuthorsState } from './random-authors/random-authors.state';
import { RandomBooks } from './random-books/random-books';
import { VoiceAudioState } from './voice-audio/voice-audio.state';
import { VoiceSettingsState } from './voice-settings/voice-settings.state';

export interface AppState {
  loading: LoadingState;
  voiceSettings: VoiceSettingsState;
  voiceAudio: VoiceAudioState;
  activeBook: ActiveBookState;
  allAuthors: AllAuthorsState;
  randomAuthors: RandomAuthorsState;
  randomBooks: RandomBooks;
  authorBooks: AuthorBooksState;
  authorSummary: AuthorSummaryState;
  genreAuthors: GenreAuthorsState;
  bookSummary: BookSummaryState;
}
