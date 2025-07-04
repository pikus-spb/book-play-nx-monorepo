import { Route } from '@angular/router';
import { DEFAULT_TITLE } from '@book-play/constants';
import { StopBookPlayGuard } from './guards/stop-book-play.guard';
import { AuthorSummaryResolver } from './resolvers/author-summary.resolver';
import { BookResolver } from './resolvers/book.resolver';

export const APP_ROUTES: Route[] = [
  {
    path: 'welcome',
    loadComponent() {
      return import('../../features/welcome/components/welcome.component').then(
        (imported) => imported.WelcomeComponent
      );
    },
    title: DEFAULT_TITLE,
  },
  {
    path: 'book/:id',
    loadComponent() {
      return import('../../features/book/components/book/book.component').then(
        (imported) => imported.BookComponent
      );
    },
    resolve: {
      book: BookResolver,
    },
  },
  {
    path: 'player',
    loadComponent() {
      return import(
        '../../features/player/components/player/player.component'
      ).then((imported) => imported.PlayerComponent);
    },
    canDeactivate: [StopBookPlayGuard],
  },
  {
    path: 'player/:id',
    loadComponent() {
      return import(
        '../../features/player/components/player/player.component'
      ).then((imported) => imported.PlayerComponent);
    },
    canDeactivate: [StopBookPlayGuard],
  },
  {
    path: 'author/:id',
    loadComponent() {
      return import(
        '../../features/author/components/author/author.component'
      ).then((imported) => imported.AuthorComponent);
    },
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
    title: DEFAULT_TITLE,
  },
  {
    path: 'books',
    loadComponent() {
      return import(
        '../../features/books/components/books/books.component'
      ).then((imported) => imported.BooksComponent);
    },
    title: DEFAULT_TITLE,
  },
  {
    path: 'books/:search',
    loadComponent() {
      return import(
        '../../features/books/components/books/books.component'
      ).then((imported) => imported.BooksComponent);
    },
    title: DEFAULT_TITLE,
  },
  {
    path: '404',
    loadComponent() {
      return import('../../features/404/components/not-found.component').then(
        (imported) => imported.NotFoundComponent
      );
    },
    title: DEFAULT_TITLE,
  },
  {
    path: 'for-right-holders',
    loadComponent() {
      return import(
        '../../features/for-right-holders/components/for-right-holders.component'
      ).then((imported) => imported.ForRightHoldersComponent);
    },
    title: DEFAULT_TITLE,
  },
  {
    path: 'settings',
    loadComponent() {
      return import(
        '../../features/settings/components/settings/settings.component'
      ).then((imported) => imported.SettingsComponent);
    },
    title: DEFAULT_TITLE,
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', redirectTo: '404' },
];
