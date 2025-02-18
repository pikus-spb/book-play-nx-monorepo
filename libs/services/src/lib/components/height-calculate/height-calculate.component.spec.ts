import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeightCalculateComponent } from './height-calculate.component';

describe('HeightCalculateComponentComponent', () => {
  let component: HeightCalculateComponent;
  let fixture: ComponentFixture<HeightCalculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeightCalculateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeightCalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
