import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { getOuterHeight } from '@book-play/utils-browser';
import { HeightDelta } from '../../model/delta';

const SAMPLE = `Участвовавшая в беседе Нэнси Уайт – популяризатор науки, создатель нескольких шоу с миллионной аудиторией – заметила, что все это чушь: она не намерена предаваться подобным фантазиям, когда на третьей планете, с ее живыми океанами, обширными лесами и крупными животными, происходит настоящая катастрофа. Планете дали мрачное название: «Обреченная». До сих пор суматоха, вызванная появлением незваного гостя, ее почти не касалась. Правда, ее орбита стала эксцентричной, но это не шло ни в какое сравнение с тем, что должно было случиться с планетой и ее биосферой. Все знали, что в ближайшие несколько часов океаны Обреченной испарятся, а от атмосферы не останется и следа.`;

@Component({
  selector: 'lib-calculate',
  templateUrl: './calculate.component.html',
  styles: [
    `
      p {
        visibility: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateComponent {
  protected text: WritableSignal<string> = signal<string>('');
  private readonly textSample = SAMPLE;
  private sample = viewChild<ElementRef>('sample');

  public async calculate(): Promise<HeightDelta> {
    if (this.sample()) {
      let height;
      let prevHeight = 0;
      let outerHeight = 0;

      const result: HeightDelta = {
        height: 0,
        length: 0,
        margin: 0,
      };

      for (let i = 1; i < this.textSample.length; i++) {
        this.text.set(this.textSample.substring(0, i));

        await new Promise((resolve) => setTimeout(() => resolve(null)));

        height = this.sample()!.nativeElement.clientHeight;
        if (outerHeight === 0) {
          outerHeight = getOuterHeight(this.sample()!.nativeElement);
        }

        if (height > prevHeight) {
          if (prevHeight === 0) {
            result.height = height;
            result.margin = outerHeight - height;
          }
          if (prevHeight > 0) {
            result.length = i - 1;
            break;
          }
          prevHeight = height;
        }
      }

      return Promise.resolve(result);
    }

    return Promise.reject();
  }
}
