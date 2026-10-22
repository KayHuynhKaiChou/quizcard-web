import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmInteraction } from '../../../types';

@Component({
  selector: 'app-chat-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-confirm.component.html',
  styleUrls: ['./chat-confirm.component.scss'],
})
export class ChatConfirmComponent {
  @Input({ required: true }) interaction!: ConfirmInteraction;
  @Output() submitted = new EventEmitter<{
    interactionId: string;
    action: 'submit' | 'cancel';
    data?: any;
    summaryText?: string;
  }>();

  onConfirm() {
    this.submitted.emit({
      interactionId: this.interaction.id,
      action: 'submit',
      data: this.interaction.details || {},
      summaryText: `Đã xác nhận: ${this.interaction.summary}`,
    });
  }

  onCancel() {
    this.submitted.emit({
      interactionId: this.interaction.id,
      action: 'cancel',
      summaryText: `Đã hủy: ${this.interaction.summary}`,
    });
  }
}
