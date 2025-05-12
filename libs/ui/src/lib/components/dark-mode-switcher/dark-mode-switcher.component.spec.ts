import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkModeSwitcherComponent } from './dark-mode-switcher.component';

xdescribe('DarkModeSwitcherComponent', () => {
  let component: DarkModeSwitcherComponent;
  let fixture: ComponentFixture<DarkModeSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkModeSwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DarkModeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
