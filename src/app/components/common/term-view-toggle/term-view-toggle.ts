import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-term-view-toggle',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
    <div class="view-toggle">
      <button
        pButton
        icon="pi pi-clone"
        class="p-button-text p-button-sm"
        [class.active]="view() === 'flashcard'"
        (click)="setView('flashcard')">
      </button>
      <button
        pButton
        icon="pi pi-th-large"
        class="p-button-text p-button-sm"
        [class.active]="view() === 'grid'"
        (click)="setView('grid')">
      </button>
    </div>
  `,
    styles: [`
    @use '../../../styles/variables' as *;
    .view-toggle {
      display: flex; gap: 0.25rem; background: $bg-secondary;
      border-radius: $radius-button; padding: 0.25rem;
      button { border-radius: 6px !important; }
      .active { background: rgba(255, 255, 255, 0.1) !important; color: $text-primary !important; }
    }
  `],
})
export class TermViewToggle {
    @Output() viewChange = new EventEmitter<'flashcard' | 'grid'>();
    view = signal<'flashcard' | 'grid'>('flashcard');

    setView(v: 'flashcard' | 'grid'): void {
        this.view.set(v);
        this.viewChange.emit(v);
    }
}
