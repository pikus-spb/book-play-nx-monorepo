import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculateComponent } from './calculate.component';

describe('HeightComponentComponent', () => {
  let component: CalculateComponent;
  let fixture: ComponentFixture<CalculateComponent>;

  TestBed.configureTestingModule({
    imports: [CalculateComponent],
    providers: [provideExperimentalZonelessChangeDetection()],
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(CalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
