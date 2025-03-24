import { Route } from '@angular/router';
import { DEFAULT_TITLE } from '@book-play/constants';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent() {
      return import('../components/main/main.component').then(
        (imported) => imported.MainComponent
      );
    },
    children: [
      {
        path: 'welcome',
        loadComponent() {
          return import('../../welcome/components/welcome.component').then(
            (imported) => imported.WelcomeComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      {
        path: 'book/:id',
        loadComponent() {
          return import('../..//book/components/book/book.component').then(
            (imported) => imported.BookComponent
          );
        },
      },
      {
        path: 'player',
        loadComponent() {
          return import('../../player/components/player/player.component').then(
            (imported) => imported.PlayerComponent
          );
        },
      },
      {
        path: 'player/:id',
        loadComponent() {
          return import('../../player/components/player/player.component').then(
            (imported) => imported.PlayerComponent
          );
        },
      },
      {
        path: 'author/:id',
        loadComponent() {
          return import('../../author/components/author/author.component').then(
            (imported) => imported.AuthorComponent
          );
        },
      },
      {
        path: 'author/genre/:genre',
        loadComponent() {
          return import(
            '../../authors-by-genre/components/authors-by-genre/authors-by-genre.component'
          ).then((imported) => imported.AuthorsByGenreComponent);
        },
      },
      {
        path: 'voice',
        loadComponent() {
          return import('../../voice/components/voice.component').then(
            (imported) => imported.VoiceComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      {
        path: 'library',
        loadComponent() {
          return import(
            '../../library/components/library/library.component'
          ).then((imported) => imported.LibraryComponent);
        },
        title: DEFAULT_TITLE,
      },
      {
        path: '404',
        loadComponent() {
          return import('../../404/components/not-found.component').then(
            (imported) => imported.NotFoundComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      {
        path: 'for-right-holders',
        loadComponent() {
          return import(
            '../../for-right-holders/components/for-right-holders.component'
          ).then((imported) => imported.ForRightHoldersComponent);
        },
        title: DEFAULT_TITLE,
      },
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
      { path: '**', redirectTo: '404' },
    ],
  },
];
