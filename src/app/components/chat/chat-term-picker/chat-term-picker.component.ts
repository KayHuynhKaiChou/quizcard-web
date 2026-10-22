import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TermPickerInteraction, TermPickerItem } from '../../../types';

@Component({
  selector: 'app-chat-term-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-term-picker.component.html',
  styleUrls: ['./chat-term-picker.component.scss'],
})
export class ChatTermPickerComponent implements OnInit {
  @Input({ required: true }) interaction!: TermPickerInteraction;
  @Output() submitted = new EventEmitter<{
    interactionId: string;
    action: 'submit' | 'cancel';
    data?: any;
    summaryText?: string;
  }>();

  terms: TermPickerItem[] = [];

  ngOnInit() {
    if (this.interaction?.terms) {
      // Clone terms to allow local editing without mutating original
      this.terms = this.interaction.terms.map((t) => ({ ...t }));
    }
  }

  get selectedCount(): number {
    return this.terms.filter((t) => t.checked).length;
  }

  get allChecked(): boolean {
    return this.terms.length > 0 && this.terms.every((t) => t.checked);
  }

  toggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.terms.forEach((t) => (t.checked = isChecked));
  }

  onSubmit() {
    const selected = this.terms.filter((t) => t.checked);
    if (selected.length === 0) {
      return;
    }

    const summary = `Đã chọn ${selected.length} từ vựng từ bộ gợi ý`;
    this.submitted.emit({
      interactionId: this.interaction.id,
      action: 'submit',
      data: {
        selectedTerms: selected,
        count: selected.length,
      },
      summaryText: summary,
    });
  }

  onCancel() {
    this.submitted.emit({
      interactionId: this.interaction.id,
      action: 'cancel',
      summaryText: 'Đã hủy chọn từ vựng',
    });
  }
}
