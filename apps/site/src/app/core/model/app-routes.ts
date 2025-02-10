import { Route } from '@angular/router';
import { DEFAULT_TITLE } from 'app/shared/services/document-title.service';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent() {
      return import('app/core/components/main/main.component').then(
        (imported) => imported.MainComponent
      );
    },
    children: [
      {
        path: 'welcome',
        loadComponent() {
          return import(
            'app/modules/welcome/components/welcome.component'
          ).then((imported) => imported.WelcomeComponent);
        },
        title: DEFAULT_TITLE,
      },
      {
        path: 'player/:id',
        loadComponent() {
          return import(
            'app/modules/player/components/player/player.component'
          ).then((imported) => imported.PlayerComponent);
        },
      },
      {
        path: 'player',
        loadComponent() {
          return import(
            'app/modules/player/components/player/player.component'
          ).then((imported) => imported.PlayerComponent);
        },
      },
      {
        path: 'voice',
        loadComponent() {
          return import('app/modules/voice/components/voice.component').then(
            (imported) => imported.VoiceComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      {
        path: 'library',
        loadComponent() {
          return import(
            'app/modules/library/components/library/library.component'
          ).then((imported) => imported.LibraryComponent);
        },
        title: DEFAULT_TITLE,
      },
      {
        path: '404',
        loadComponent() {
          return import('app/modules/404/components/not-found.component').then(
            (imported) => imported.NotFoundComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
      { path: '**', redirectTo: '404' },
    ],
  },
];
