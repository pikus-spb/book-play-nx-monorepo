import {
  Component,
  DebugElement,
  Signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventsStateService } from 'app/shared/services/events-state.service';
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

describe('LoadingThenShowDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveEl: DebugElement;
  let directive: LoadingThenShowDirective;
  let eventsStateServiceMock: jasmine.SpyObj<EventsStateService>;

  beforeEach(() => {
    // Create a mock for the EventsStateService
    eventsStateServiceMock = jasmine.createSpyObj('EventsStateService', [
      'get',
    ]);

    TestBed.configureTestingModule({
      imports: [LoadingThenShowDirective, TestComponent],
      providers: [
        ViewContainerRef,
        { provide: TemplateRef, useValue: {} as TemplateRef<unknown> },
        { provide: EventsStateService, useValue: eventsStateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    directiveEl = fixture.debugElement.query(
      By.directive(LoadingThenShowDirective)
    );
    directive = directiveEl.injector.get(LoadingThenShowDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should create a loading component when loading', () => {
    eventsStateServiceMock.get.and.returnValue((() => {
      return true;
    }) as unknown as Signal<boolean>);
    fixture.detectChanges();
    expect(eventsStateServiceMock.get).toHaveBeenCalled();
    expect(
      fixture.nativeElement.innerHTML.indexOf('<loading-indicator') > 0
    ).toBeTruthy();
  });

  it('should initialize the embedded view when not loading', () => {
    eventsStateServiceMock.get.and.returnValue((() => {
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
