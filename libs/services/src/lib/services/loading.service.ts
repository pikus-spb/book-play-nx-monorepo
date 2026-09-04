import { computed, Injectable, signal } from '@angular/core';
import { defer, finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private pending = signal(0);
  readonly loading = computed(() => this.pending() > 0);

  start(): void {
    this.pending.update((count) => count + 1);
  }

  end(): void {
    this.pending.update((count) => Math.max(0, count - 1));
  }

  track<T>(source: Observable<T>): Observable<T> {
    return defer(() => {
      this.start();
      return source.pipe(finalize(() => this.end()));
    });
  }

  async trackPromise<T>(promise: Promise<T>): Promise<T> {
    this.start();
    try {
      return await promise;
    } finally {
      this.end();
    }
  }
}
