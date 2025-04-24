import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterHelperService {
  private router = inject(Router);

  public isRouteActive(route: string): boolean {
    return this.router.url.indexOf(route) > -1;
  }
}
