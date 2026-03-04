import { Component, Input } from '@angular/core';
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
}
