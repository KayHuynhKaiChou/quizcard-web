import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CreateTermRequest } from '../../../types';

const LINE_HEIGHT_PX = 21; // 0.875rem * 1.5 line-height ≈ 21px
const MAX_ROWS = 4;

export interface TermRow {
  term: string;
  definition: string;
}

@Component({
  selector: 'app-term-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './term-editor.html',
  styleUrl: './term-editor.scss',
})
export class TermEditor {
  @Input() set initialTerms(value: CreateTermRequest[]) {
    if (value?.length) {
      this.rows.set(value.map((t) => ({ term: t.term, definition: t.definition })));
    }
  }
  @Output() termsChange = new EventEmitter<TermRow[]>();

  rows = signal<TermRow[]>([{ term: '', definition: '' }, { term: '', definition: '' }]);

  addRow(): void {
    this.rows.update((r) => [...r, { term: '', definition: '' }]);
    this.emitChange();
  }

  removeRow(index: number): void {
    if (this.rows().length <= 1) return;
    this.rows.update((r) => r.filter((_, i) => i !== index));
    this.emitChange();
  }

  onFieldChange(): void {
    this.emitChange();
  }

  autoResize(el: EventTarget | null): void {
    const textarea = el as HTMLTextAreaElement;
    if (!textarea) return;
    const maxHeight = LINE_HEIGHT_PX * MAX_ROWS + 16; // 16px = vertical padding
    textarea.style.height = 'auto';
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
  }

  private emitChange(): void {
    this.termsChange.emit(this.rows());
  }

  trackByIndex(index: number): number {
    return index;
  }
}
