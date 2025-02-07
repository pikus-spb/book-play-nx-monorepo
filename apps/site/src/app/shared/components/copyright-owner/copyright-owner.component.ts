import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'copyright-owner',
  templateUrl: './copyright-owner.component.html',
  styleUrls: ['./copyright-owner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CopyrightOwnerComponent {
  public href: string = [
    'mailto:pikus@post.com?',
    'subject=',
    'Нарушение авторских прав',
    '&body=',
    'Добрый день, Петр Савельев!%0A',
    `Прошу удалить книгу, нарушающую авторские права:%0A

    %0A<укажите название>%0A

    %0A<укажите претензию>%0A

    %0A(Если ваши авторские права будут подтверждены, книга будет удалена в течении 2 недель, спасибо за понимание)`,
  ].join('');
}
