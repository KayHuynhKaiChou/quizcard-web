import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInteraction } from '../../../types';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-chat-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss'],
})
export class ChatFormComponent implements OnInit {
  @Input({ required: true }) interaction!: FormInteraction;
  @Output() submitted = new EventEmitter<{
    interactionId: string;
    action: 'submit' | 'cancel';
    data?: any;
    summaryText?: string;
  }>();

  formData: Record<string, any> = {};
  validationError: string | null = null;

  ngOnInit() {
    if (this.interaction?.fields) {
      for (const field of this.interaction.fields) {
        this.formData[field.name] = field.default !== undefined ? field.default : '';
      }
    }
  }

  onSubmit() {
    this.validationError = null;
    if (this.interaction?.fields) {
      for (const field of this.interaction.fields) {
        if (field.required && !this.formData[field.name]) {
          this.validationError = `Vui lòng nhập trường "${field.label}"`;
          return;
        }
      }
    }

    const summary = `Đã điền: ${this.interaction.title} (${this.formData['title'] || 'Thông tin'})`;
    this.submitted.emit({
      interactionId: this.interaction.id,
      action: 'submit',
      data: this.formData,
      summaryText: summary,
    });
  }

  onCancel() {
    this.submitted.emit({
      interactionId: this.interaction.id,
      action: 'cancel',
      summaryText: 'Đã hủy biểu mẫu',
    });
  }
}
