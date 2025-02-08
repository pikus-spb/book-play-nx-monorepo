import {
  Directive,
  Input,
  provideExperimentalZonelessChangeDetection,
  TemplateRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
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

@Directive({
  selector: '[loading]',
})
export class StubLoadingThenShowDirective {
  @Input() thenShow?: TemplateRef<unknown>;
}

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let booksApi: jest.Mocked<BooksApiService>;
  let eventStates: jest.Mocked<EventsStateService>;

  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );

  beforeEach(async () => {
    booksApi = {
      getAllGroupedByAuthor: jest.fn(),
    } as unknown as jest.Mocked<BooksApiService>;

    eventStates = {
      get: jest.fn(() => new Function()),
      add: jest.fn(() => new Function()),
      remove: jest.fn(() => new Function()),
    } as unknown as jest.Mocked<EventsStateService>;

    TestBed.configureTestingModule({
      imports: [StubLoadingThenShowDirective],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: BooksApiService, useValue: booksApi },
        { provide: EventsStateService, useValue: eventStates },
      ],
    });

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Loading state management', () => {
    test('should add loading event when data is being loaded', async () => {
      await fixture.whenStable();
      expect(eventStates.add).toHaveBeenCalledWith(AppEventNames.loading);
    });

    test('should remove loading event after data is loaded', async () => {
      booksApi.getAllGroupedByAuthor.mockResolvedValue({} as AuthorsBooks);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(eventStates.remove).toHaveBeenCalledWith(AppEventNames.loading);
    });
  });

  describe('Data handling', () => {
    test('should handle empty data correctly', async () => {
      booksApi.getAllGroupedByAuthor.mockResolvedValue({} as AuthorsBooks);

      await fixture.whenStable();
      component.data.reload();
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve));
      expect(component.data.value()).toEqual({});
    });

    test('should fetch and display grouped books', async () => {
      const mockData: AuthorsBooks = { author1: [{} as BookDescription] };
      booksApi.getAllGroupedByAuthor.mockResolvedValue(mockData);

      await fixture.whenStable();
      component.data.reload();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve));

      expect(component.data.value()).toEqual(mockData);
    });
  });

  describe('Error handling', () => {
    test('should handle API errors gracefully', async () => {
      booksApi.getAllGroupedByAuthor.mockRejectedValue(new Error('API error'));

      await fixture.whenStable();
      component.data.reload();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve));

      expect(component.data.value()).toBeUndefined();
    });
  });
});
