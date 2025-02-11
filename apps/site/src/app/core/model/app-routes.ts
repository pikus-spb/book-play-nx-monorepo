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
          return import(
            '../../modules/welcome/components/welcome.component'
          ).then((imported) => imported.WelcomeComponent);
        },
        title: DEFAULT_TITLE,
      },
      {
        path: 'player/:id',
        loadComponent() {
          return import(
            '../../modules/player/components/player/player.component'
          ).then((imported) => imported.PlayerComponent);
        },
      },
      {
        path: 'player',
        loadComponent() {
          return import(
            '../../modules/player/components/player/player.component'
          ).then((imported) => imported.PlayerComponent);
        },
      },
      {
        path: 'voice',
        loadComponent() {
          return import('../../modules/voice/components/voice.component').then(
            (imported) => imported.VoiceComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      {
        path: 'library',
        loadComponent() {
          return import(
            '../../modules/library/components/library/library.component'
          ).then((imported) => imported.LibraryComponent);
        },
        title: DEFAULT_TITLE,
      },
      {
        path: '404',
        loadComponent() {
          return import(
            '../../modules/404/components/not-found.component'
          ).then((imported) => imported.NotFoundComponent);
        },
        title: DEFAULT_TITLE,
      },
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
      { path: '**', redirectTo: '404' },
    ],
  },
];
