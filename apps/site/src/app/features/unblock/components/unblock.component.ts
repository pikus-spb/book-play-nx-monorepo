import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { environment, UNBLOCK_CONTENT_COOKIE_NAME } from '@book-play/constants';

@Component({
  selector: 'book-play-unblock',
  imports: [],
  templateUrl: './unblock.component.html',
  styleUrl: './unblock.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnblockComponent implements OnInit {
  ngOnInit(): void {
    document.cookie = `${UNBLOCK_CONTENT_COOKIE_NAME}=${environment.UNBLOCK_CONTENT_PASSWORD}; path=/; max-age=31536000`;
  }
}
