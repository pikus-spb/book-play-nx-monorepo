import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ActiveBookEffects } from '../shared/store/active-book/active-book.effects';
import { activeBookReducers } from '../shared/store/active-book/active-book.reducers';
import { AllAuthorsEffects } from '../shared/store/all-authors/all-authors.effects';
import { allAuthorsReducers } from '../shared/store/all-authors/all-authors.reducers';
import { AuthorBooksEffects } from '../shared/store/author-books/author-books.effects';
import { authorBooksReducers } from '../shared/store/author-books/author-books.reducers';
import { AuthorSummaryEffects } from '../shared/store/author-summary/author-summary.effects';
import { authorSummaryReducers } from '../shared/store/author-summary/author-summary.reducers';
import { BookSearchEffects } from '../shared/store/book-search/book-search.effects';
import { bookSearchReducers } from '../shared/store/book-search/book-search.reducers';
import { BookSummaryEffects } from '../shared/store/book-summary/book-summary.effects';
import { bookSummaryReducers } from '../shared/store/book-summary/book-summary.reducers';
import { loadingReducer } from '../shared/store/loading/loading.reducer';
import { RandomAuthorSummaryEffects } from '../shared/store/random-author-details/random-author-summary.effects';
import { randomAuthorSummaryReducers } from '../shared/store/random-author-details/random-author-summary.reducers';
import { RandomBooksEffects } from '../shared/store/random-books/random-books.effects';
import { randomBooksReducers } from '../shared/store/random-books/random-books.reducers';
import { VoiceAudioEffects } from '../shared/store/voice-audio/voice-audio.effects';
import { voiceAudioReducers } from '../shared/store/voice-audio/voice-audio.reducers';
import { VoiceSettingsEffects } from '../shared/store/voice-settings/voice-settings.effects';
import { voiceSettingsReducers } from '../shared/store/voice-settings/voice-settings.reducers';

import { MainComponent } from './components/main/main.component';
import { APP_ROUTES } from './routing/app-routes';

bootstrapApplication(MainComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
    provideExperimentalZonelessChangeDetection(),
    importProvidersFrom(
      StoreModule.forRoot({
        router: routerReducer,
        loading: loadingReducer,
        voiceSettings: voiceSettingsReducers,
        voiceAudio: voiceAudioReducers,
        activeBook: activeBookReducers,
        allAuthors: allAuthorsReducers,
        randomAuthors: randomAuthorSummaryReducers,
        randomBooks: randomBooksReducers,
        authorBooks: authorBooksReducers,
        authorSummary: authorSummaryReducers,
        bookSummary: bookSummaryReducers,
        bookSearch: bookSearchReducers,
      }),
      EffectsModule.forRoot([]),
      EffectsModule.forFeature([
        VoiceSettingsEffects,
        VoiceAudioEffects,
        ActiveBookEffects,
        AllAuthorsEffects,
        RandomAuthorSummaryEffects,
        RandomBooksEffects,
        AuthorBooksEffects,
        AuthorSummaryEffects,
        BookSummaryEffects,
        BookSearchEffects,
      ]),
      StoreDevtoolsModule.instrument(),
      StoreRouterConnectingModule.forRoot()
    ),
  ],
}).catch((err) => console.error(err));
