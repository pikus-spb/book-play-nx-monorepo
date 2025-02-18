import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeightComponentComponent } from './calculate.component';

describe('HeightComponentComponent', () => {
  let component: HeightComponentComponent;
  let fixture: ComponentFixture<HeightComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeightComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeightComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
