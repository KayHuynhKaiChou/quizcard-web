import { Component, Input, Output, EventEmitter, signal, OnChanges, SimpleChanges, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Term } from '../../../types';

@Component({
  selector: 'app-flashcard',
  imports: [CommonModule],
  templateUrl: './flashcard.html',
  styleUrl: './flashcard.scss',
})
export class Flashcard implements OnChanges {
  private platformId = inject(PLATFORM_ID);
  @Input() term!: Term;
  @Input() showTermFirst = true;
  /** Parent hosts the sentence modal; the card only asks for it. */
  @Output() sentencesRequested = new EventEmitter<Term>();
  isFlipped = signal(false);
  isSpeaking = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['term']) {
      this.isFlipped.set(false);
    }
  }

  flip(): void {
    this.isFlipped.update((value) => !value);
  }

  openSentences(event: Event): void {
    // Same guard as speak(): the whole card is a flip target.
    event.stopPropagation();
    this.sentencesRequested.emit(this.term);
  }

  speak(text: string, event: Event): void {
    event.stopPropagation();
    if (!isPlatformBrowser(this.platformId) || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => this.isSpeaking.set(true);
    utterance.onend = () => this.isSpeaking.set(false);
    utterance.onerror = () => this.isSpeaking.set(false);
    window.speechSynthesis.speak(utterance);
  }

  get frontLabel(): string {
    return this.showTermFirst ? 'Thuật ngữ' : 'Nghĩa';
  }

  get frontContent(): string {
    return this.showTermFirst ? this.term.term : this.term.definition;
  }

  get frontIpa(): string | null {
    return this.showTermFirst ? this.term.ipa : null;
  }

  get backLabel(): string {
    return this.showTermFirst ? 'Nghĩa' : 'Thuật ngữ';
  }

  get backContent(): string {
    return this.showTermFirst ? this.term.definition : this.term.term;
  }

  get backIpa(): string | null {
    return this.showTermFirst ? null : this.term.ipa;
  }
}
