import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { firstValueFrom, of } from 'rxjs';
import { KeepScreenOnComponent } from './keep-screen-on.component';

jest.mock('cheerio', () => ({
  load: jest.fn(),
}));

describe('KeepScreenOnComponent', () => {
  let component: KeepScreenOnComponent;
  let fixture: ComponentFixture<KeepScreenOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeepScreenOnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeepScreenOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with disabled input as true', async () => {
    expect(await firstValueFrom(component.disabled())).toBe(true);
  });

  it('should have video element with correct source when disabled is false', () => {
    fixture.componentRef.setInput('disabled', of(false));
    fixture.detectChanges();
    const videoElement = fixture.debugElement.query(By.css('video'));
    expect(videoElement).toBeTruthy();
    expect(videoElement.nativeElement.src).toContain(
      'data:video/mp4;base64,AAA'
    );
  });

  it('should not create video element when disabled', () => {
    fixture.componentRef.setInput('disabled', of(true));
    fixture.detectChanges();
    const videoElement = fixture.debugElement.query(By.css('video'));
    expect(videoElement).toBeNull();
  });

  it('should start video playback on document click when disabled is false', () => {
    fixture.componentRef.setInput('disabled', of(false));
    fixture.detectChanges();
    const videoElement = fixture.debugElement.query(
      By.css('video')
    ).nativeElement;
    const spy = jest.spyOn(videoElement, 'play');
    document.dispatchEvent(new Event('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should start video playback on touchend when disabled is false', () => {
    fixture.componentRef.setInput('disabled', of(false));
    fixture.detectChanges();
    const videoElement = fixture.debugElement.query(
      By.css('video')
    ).nativeElement;
    const spy = jest.spyOn(videoElement, 'play');
    document.dispatchEvent(new Event('touchend'));
    expect(spy).toHaveBeenCalled();
  });
});
