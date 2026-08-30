import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Term } from '../../../types';
import { Flashcard } from '../flashcard/flashcard';

@Component({
    selector: 'app-term-grid',
    imports: [Flashcard],
    templateUrl: './term-grid.html',
    styleUrl: './term-grid.scss',
})
export class TermGrid {
    @Input() terms: Term[] = [];
    /** Forwarded from each card up to the page that hosts the sentence modal. */
    @Output() sentencesRequested = new EventEmitter<Term>();
}
