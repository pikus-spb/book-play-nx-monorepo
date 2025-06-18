import { provideZonelessChangeDetection, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DarkModeSwitcherComponent } from './dark-mode-switcher.component';

jest.mock('@book-play/utils-browser', () => ({
  ...jest.requireActual('@book-play/utils-browser'),
  isDarkMode: jest.fn(),
  listenDarkModeChange: jest.fn(),
}));

describe('DarkModeSwitcherComponent', () => {
  let component: DarkModeSwitcherComponent;
  let fixture: ComponentFixture<DarkModeSwitcherComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    await TestBed.configureTestingModule({
      imports: [DarkModeSwitcherComponent, MatSlideToggleModule, MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DarkModeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dark mode when the toggle button is clicked', () => {
    const mockRenderer = {
      addClass: jest.fn(),
      removeClass: jest.fn(),
    };

    // @ts-expect-error: private renderer: Renderer2;
    component.renderer = mockRenderer as Renderer2;
    // @ts-expect-error: protected isDarkMode: Signal<boolean>;
    component.isDarkMode.set(false);
    // @ts-expect-error: protected toggleDarkMode(): void;
    component.toggleDarkMode();

    expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, 'dark');
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(
      document.body,
      'light'
    );
  });
});
