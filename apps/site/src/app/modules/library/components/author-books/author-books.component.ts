import { CommonModule, KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { BookDescription } from '@book-play/models';

@Component({
  selector: 'author-books',
  imports: [
    CommonModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatAccordion,
  ],
  templateUrl: './author-books.component.html',
  styleUrl: './author-books.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorBooksComponent {
  @Input() data!: KeyValue<string, BookDescription[]>;
}
