import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  importProvidersFrom,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  ActiveBookEffects,
  activeBookReducers,
  AuthorBooksEffects,
  authorBooksReducers,
  AuthorSummaryEffects,
  authorSummaryReducers,
  BookSearchEffects,
  bookSearchReducers,
  BookSummaryEffects,
  bookSummaryReducers,
  loadingReducer,
  RandomAuthorSummaryEffects,
  randomAuthorSummaryReducers,
  RandomBooksEffects,
  randomBooksReducers,
  SettingsEffects,
  settingsReducers,
  VoiceAudioEffects,
  voiceAudioReducers,
} from '@book-play/store';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StarRatingModule } from 'angular-star-rating';

import { MainComponent } from './components/main/main.component';
import { APP_ROUTES } from './routing/app-routes';
import { UnblockContentInterceptor } from './routing/http-interceptor/unblock-content.interceptor';

bootstrapApplication(MainComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
    provideZonelessChangeDetection(),
    provideAnimations(),
    importProvidersFrom(StarRatingModule.forRoot()),
    importProvidersFrom(
      StoreModule.forRoot({
        router: routerReducer,
        loading: loadingReducer,
        settings: settingsReducers,
        voiceAudio: voiceAudioReducers,
        activeBook: activeBookReducers,
        randomAuthors: randomAuthorSummaryReducers,
        randomBooks: randomBooksReducers,
        authorBooks: authorBooksReducers,
        authorSummary: authorSummaryReducers,
        bookSummary: bookSummaryReducers,
        bookSearch: bookSearchReducers,
      }),
      EffectsModule.forRoot([]),
      EffectsModule.forFeature([
        SettingsEffects,
        VoiceAudioEffects,
        ActiveBookEffects,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnblockContentInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
