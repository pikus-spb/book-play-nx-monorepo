import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculateComponent } from './calculate.component';
import { HeightCalculateComponent } from './height-calculate.component';

describe('HeightCalculateComponentComponent', () => {
  let component: HeightCalculateComponent;
  let fixture: ComponentFixture<HeightCalculateComponent>;

  TestBed.configureTestingModule({
    imports: [HeightCalculateComponent],
    providers: [
      CalculateComponent,
      provideExperimentalZonelessChangeDetection(),
    ],
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(HeightCalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
