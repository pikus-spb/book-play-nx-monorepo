import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeightCalculateComponentComponent } from './height-calculate.component';

describe('HeightCalculateComponentComponent', () => {
  let component: HeightCalculateComponentComponent;
  let fixture: ComponentFixture<HeightCalculateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeightCalculateComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeightCalculateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
