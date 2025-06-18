import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
  Signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { EventsStateService } from '../../services/events-state.service';
import { LoadingThenShowDirective } from './loading-then-show.directive';

@Component({
  selector: 'test-component',
  template:
    '<ng-template #templateMock>{{embeddedContent}}</ng-template><h1 loading [thenShow]="templateMock">Header</h1>',
  standalone: true,
  imports: [LoadingThenShowDirective],
})
class TestComponent {
  public embeddedContent = 'testComponentContent';
}

xdescribe('LoadingThenShowDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveEl: DebugElement;
  let directive: LoadingThenShowDirective;
  let eventsStateServiceMock: jest.Mocked<EventsStateService>;

  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );

  beforeEach(() => {
    eventsStateServiceMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<EventsStateService>;

    TestBed.configureTestingModule({
      imports: [LoadingThenShowDirective, TestComponent],
      providers: [
        provideZonelessChangeDetection(),
        ViewContainerRef,
        { provide: TemplateRef, useValue: {} as TemplateRef<unknown> },
        { provide: EventsStateService, useValue: eventsStateServiceMock },
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    directiveEl = fixture.debugElement.query(
      By.directive(LoadingThenShowDirective)
    );
    directive = directiveEl.injector.get(LoadingThenShowDirective);
  });

  test('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  test('should create a loading component when loading', () => {
    eventsStateServiceMock.get.mockReturnValue((() => {
      return true;
    }) as unknown as Signal<boolean>);
    fixture.detectChanges();
    expect(eventsStateServiceMock.get).toHaveBeenCalled();
    expect(
      fixture.nativeElement.innerHTML.indexOf('<loading-indicator') > 0
    ).toBeTruthy();
  });

  test('should initialize the embedded view when not loading', () => {
    eventsStateServiceMock.get.mockReturnValue((() => {
      return false;
    }) as unknown as Signal<boolean>);
    fixture.detectChanges();

    const embeddedContent = fixture.componentInstance.embeddedContent;

    expect(eventsStateServiceMock.get).toHaveBeenCalled();
    expect(
      fixture.nativeElement.innerHTML.indexOf(embeddedContent) > 0
    ).toBeTruthy();
  });
});
