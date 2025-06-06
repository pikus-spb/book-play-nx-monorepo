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
import { Author } from '@book-play/models';
import { BooksApiService } from '../../../../shared/services/books/books-api.service';
import { EventsStateService } from '../../../../shared/services/events-state.service';
import { AuthorsComponent } from './authors.component';

@Directive({
  selector: '[loading]',
})
export class StubLoadingThenShowDirective {
  @Input() thenShow?: TemplateRef<unknown>;
}

xdescribe('LibraryComponent', () => {
  let component: AuthorsComponent;
  let fixture: ComponentFixture<AuthorsComponent>;
  let booksApi: jest.Mocked<BooksApiService>;
  let eventStates: jest.Mocked<EventsStateService>;

  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );

  beforeEach(async () => {
    booksApi = {
      getAllAuthors: jest.fn(),
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

    fixture = TestBed.createComponent(AuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xtest('should create', () => {
    expect(component).toBeTruthy();
  });

  xdescribe('Loading state management', () => {
    test('should add loading event when data is being loaded', async () => {
      await fixture.whenStable();
      // expect(eventStates.add).toHaveBeenCalledWith(AppEventNames.loading);
    });

    test('should remove loading event after data is loaded', async () => {
      // booksApi.AllAuthors.mockResolvedValue([] as Author[]);

      await fixture.whenStable();
      fixture.detectChanges();

      // expect(eventStates.remove).toHaveBeenCalledWith(AppEventNames.loading);
    });
  });

  xdescribe('Data handling', () => {
    test('should handle empty data correctly', async () => {
      // booksApi.getAllAuthors.mockResolvedValue([] as Author[]);

      await fixture.whenStable();
      // @ts-expect-error: data is protected
      component.data.reload();
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve));
      // @ts-expect-error: data is protected
      expect(component.data.value()).toEqual([]);
    });

    xtest('should fetch and display authors', async () => {
      const mockData: Author[] = [
        new Author({
          first: 'A',
          last: 'B',
        }),
        new Author({
          first: '',
          last: 'BBB',
        }),
      ] as Author[];

      // booksApi.getAllAuthors.mockResolvedValue(mockData);

      await fixture.whenStable();
      // @ts-expect-error: data is protected
      component.data.reload();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve));

      // @ts-expect-error: data is protected
      expect(component.data.value()).toEqual(mockData);
    });
  });

  xdescribe('Error handling', () => {
    test('should handle API errors gracefully', async () => {
      // booksApi.getAllAuthors.mockRejectedValue(new Error('API error'));

      await fixture.whenStable();
      // @ts-expect-error: data is protected
      component.data.reload();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve));

      // @ts-expect-error: data is protected
      expect(component.data.value()).toBeUndefined();
    });
  });
});
