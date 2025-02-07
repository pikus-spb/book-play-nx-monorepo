import { Directive, Input, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AuthorsBooks,
  BookDescription,
} from 'app/modules/library/model/books-model';
import { BooksApiService } from 'app/modules/library/services/books-api.service';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';
import { LibraryComponent } from './library.component';
import SpyObj = jasmine.SpyObj;

@Directive({
  selector: '[loading]',
})
export class StubLoadingThenShowDirective {
  @Input() thenShow?: TemplateRef<unknown>;
}

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let booksApi: SpyObj<BooksApiService>;
  let eventStates: SpyObj<EventsStateService>;

  beforeEach(() => {
    booksApi = jasmine.createSpyObj<BooksApiService>('BooksApiService', [
      'getAllGroupedByAuthor',
    ]);
    eventStates = jasmine.createSpyObj<EventsStateService>(
      'EventsStateService',
      ['get', 'add', 'remove']
    );

    TestBed.overrideComponent(LibraryComponent, {
      set: {
        providers: [
          { provide: BooksApiService, useValue: booksApi },
          { provide: EventsStateService, useValue: eventStates },
        ],
        imports: [StubLoadingThenShowDirective],
      },
    });
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;

    // Ensure the effect runs
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Loading state management', () => {
    it('should add loading event when data is being loaded', async () => {
      // Since this is a sync test, we need to wait for the effect
      await fixture.whenStable();

      // Verify that loading event was added
      expect(eventStates.add).toHaveBeenCalledWith(AppEventNames.loading);
    });

    it('should remove loading event after data is loaded', async () => {
      booksApi.getAllGroupedByAuthor.and.returnValue(
        Promise.resolve({} as AuthorsBooks)
      );

      await fixture.whenStable();
      TestBed.flushEffects();
      fixture.detectChanges();

      // Verify that loading event was removed
      expect(eventStates.remove).toHaveBeenCalledWith(AppEventNames.loading);
    });
  });

  describe('Data handling', () => {
    it('should handle empty data correctly', async () => {
      booksApi.getAllGroupedByAuthor.and.returnValue(
        Promise.resolve({} as AuthorsBooks)
      );

      await fixture.whenStable();
      component.data.reload();
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve));

      // Verify that data is set to an empty object
      expect(component.data.value()).toEqual({});
    });

    it('should fetch and display grouped books', async () => {
      const mockData: AuthorsBooks = { author1: [{} as BookDescription] };
      booksApi.getAllGroupedByAuthor.and.returnValue(Promise.resolve(mockData));

      await fixture.whenStable();
      component.data.reload();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve));

      // Verify that data is set correctly
      expect(component.data.value()).toEqual({
        author1: [{} as BookDescription],
      });
    });
  });

  describe('Error handling', () => {
    it('should handle API errors gracefully', async () => {
      booksApi.getAllGroupedByAuthor.and.returnValue(
        Promise.reject(new Error('API error'))
      );

      await fixture.whenStable();
      component.data.reload();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve));

      // Verify that data remains undefined
      expect(component.data.value()).toBeUndefined();
    });
  });
});
