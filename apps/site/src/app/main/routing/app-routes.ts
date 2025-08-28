import { inject } from '@angular/core';
import { Route } from '@angular/router';
import {
  ADVANCED_BOOK_SEARCH_TITLE,
  DEFAULT_TITLE,
  NOT_FOUND_PAGE_TITLE,
  RIGHTHOLDERS_PAGE_TITLE,
  SETTINGS_PAGE_TITLE,
  VOICE_PAGE_TITLE,
} from '@book-play/constants';
import { BookPersistenceStorageService } from '@book-play/services';
import { AuthorPageComponent, BookPageComponent } from '@book-play/ui';
import {
  getAuthorPageTitle,
  getBookPageTitle,
  getBookSearchPageTitle,
} from '@book-play/utils-browser';
import { PlayerComponent } from '../../features/player/components/player/player.component';
import { WelcomeComponent } from '../../features/welcome/components/welcome.component';
import { StopBookPlayGuard } from './guards/stop-book-play.guard';
import { AuthorSummaryResolver } from './resolvers/author-summary.resolver';
import { BookSummaryResolver } from './resolvers/book-summary.resolver';
import { BookResolver } from './resolvers/book.resolver';

export const APP_ROUTES: Route[] = [
  {
    path: 'index',
    component: WelcomeComponent,
    title: DEFAULT_TITLE,
  },
  {
    path: 'book/:id',
    children: [
      {
        path: '',
        title: (route) => {
          return getBookPageTitle(route.data['book'].full);
        },
        component: BookPageComponent,
      },
    ],
    resolve: {
      book: BookSummaryResolver,
    },
  },
  {
    path: 'player',
    children: [
      {
        path: '',
        title: (route) => {
          return getBookPageTitle(route.data['book'].full);
        },
        component: PlayerComponent,
      },
    ],
    resolve: {
      book: BookResolver,
    },
    canDeactivate: [StopBookPlayGuard],
  },
  {
    path: 'player/:id',
    children: [
      {
        path: '',
        title: (route) => {
          return getBookPageTitle(route.data['book'].full);
        },
        component: PlayerComponent,
      },
    ],
    resolve: {
      book: BookResolver,
    },
    canDeactivate: [StopBookPlayGuard],
  },
  {
    path: 'author/:id',
    children: [
      {
        path: '',
        title: (route) => {
          return getAuthorPageTitle(route.data['author'].full);
        },
        component: AuthorPageComponent,
      },
    ],
    resolve: {
      author: AuthorSummaryResolver,
    },
  },
  {
    path: 'voice',
    loadComponent() {
      return import('../../features/voice/components/voice.component').then(
        (imported) => imported.VoiceComponent
      );
    },
    title: VOICE_PAGE_TITLE,
  },
  {
    path: 'books',
    children: [
      {
        path: '',
        loadComponent() {
          return import(
            '../../features/book-search/components/books/book-search.component'
          ).then((imported) => imported.BookSearchComponent);
        },
        title: () => getBookSearchPageTitle(),
      },
      {
        path: ':search',
        loadComponent() {
          return import(
            '../../features/book-search/components/books/book-search.component'
          ).then((imported) => imported.BookSearchComponent);
        },
        title: (route) => {
          const query = route.paramMap.get('search');
          return getBookSearchPageTitle(query);
        },
      },
    ],
  },
  {
    path: 'advanced-search',
    children: [
      {
        path: '',
        loadComponent() {
          return import(
            '../../features/advanced-search/components/advanced-search/advanced-search.component'
          ).then((imported) => imported.AdvancedSearchComponent);
        },
      },
      {
        path: ':search',
        loadComponent() {
          return import(
            '../../features/advanced-search/components/advanced-search/advanced-search.component'
          ).then((imported) => imported.AdvancedSearchComponent);
        },
      },
    ],
    title: ADVANCED_BOOK_SEARCH_TITLE,
  },
  {
    path: '404',
    loadComponent() {
      return import('../../features/404/components/not-found.component').then(
        (imported) => imported.NotFoundComponent
      );
    },
    title: NOT_FOUND_PAGE_TITLE,
  },
  {
    path: 'for-right-holders',
    loadComponent() {
      return import(
        '../../features/for-right-holders/components/for-right-holders.component'
      ).then((imported) => imported.ForRightHoldersComponent);
    },
    title: RIGHTHOLDERS_PAGE_TITLE,
  },
  {
    path: 'settings',
    loadComponent() {
      return import(
        '../../features/settings/components/settings/settings.component'
      ).then((imported) => imported.SettingsComponent);
    },
    title: SETTINGS_PAGE_TITLE,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: async () => {
      const bookPersistenceStorageService = inject(
        BookPersistenceStorageService
      );
      const data = await bookPersistenceStorageService.get();
      if (data && data.content.length > 0) {
        return '/player';
      }
      return '/index';
    },
  },
  { path: '**', redirectTo: '404' },
];
