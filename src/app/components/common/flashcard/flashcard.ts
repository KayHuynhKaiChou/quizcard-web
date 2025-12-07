import { Component, Input, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vocabulary } from '../../../types';

@Component({
  selector: 'app-flashcard',
  imports: [CommonModule],
  templateUrl: './flashcard.html',
  styleUrl: './flashcard.scss'
})
export class Flashcard implements OnChanges {
  @Input() vocabulary!: Vocabulary;
  isFlipped = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vocabulary']) {
      this.isFlipped.set(false);
    }
  }

  flip(): void {
    this.isFlipped.update(value => !value);
  }
}
