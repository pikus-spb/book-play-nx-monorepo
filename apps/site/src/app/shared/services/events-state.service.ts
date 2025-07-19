import {
  effect,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';

export enum AppEventNames {
  scrollingIntoView = 'scrollingIntoView',
}

interface AppEvent {
  counter: number;
  signal: WritableSignal<boolean>;
  observable: Subject<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class EventsStateService {
  private events: Map<string, AppEvent> = new Map();

  constructor() {
    for (const name in AppEventNames) {
      const event = {
        signal: signal(false),
        counter: 0,
        observable: new Subject<boolean>(),
      };
      effect(() => {
        event.observable.next(event.signal());
      });
      this.events.set(name, event);
    }
  }

  public add(name: AppEventNames) {
    const event = this.events.get(name)!;
    event.counter++;
    event.signal.set(event.counter > 0);
  }

  public remove(name: AppEventNames, force = false) {
    const event = this.events.get(name)!;
    if (force) {
      event.counter = 0;
    } else {
      event.counter--;
    }
    event.signal.set(event.counter > 0);
  }

  public waitUntilObservable(
    name: AppEventNames,
    value: boolean
  ): Observable<boolean> {
    return this.events
      .get(name)!
      .observable.pipe(filter((current) => current === value));
  }

  public get(name: AppEventNames): Signal<boolean> {
    return this.events.get(name)!.signal;
  }

  public get$(name: AppEventNames): Observable<boolean> {
    return this.events.get(name)!.observable;
  }
}
