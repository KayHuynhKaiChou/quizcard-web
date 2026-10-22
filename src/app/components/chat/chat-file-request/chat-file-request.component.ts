import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileRequestInteraction } from '../../../types';

@Component({
  selector: 'app-chat-file-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-file-request.component.html',
  styleUrls: ['./chat-file-request.component.scss'],
})
export class ChatFileRequestComponent {
  @Input({ required: true }) interaction!: FileRequestInteraction;
  @Output() submitted = new EventEmitter<{
    interactionId: string;
    action: 'submit' | 'cancel';
    file?: File;
    summaryText?: string;
  }>();

  selectedFile: File | null = null;
  errorMsg: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  validateAndSetFile(file: File) {
    this.errorMsg = null;
    const maxMb = this.interaction.maxSizeMb || 10;
    if (file.size > maxMb * 1024 * 1024) {
      this.errorMsg = `Tệp vượt quá dung lượng tối đa cho phép (${maxMb}MB).`;
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      this.errorMsg = 'Hệ thống chỉ hỗ trợ định dạng PDF.';
      return;
    }
    this.selectedFile = file;
  }

  onSubmit() {
    if (!this.selectedFile) return;
    this.submitted.emit({
      interactionId: this.interaction.id,
      action: 'submit',
      file: this.selectedFile,
      summaryText: `Đã tải lên tệp: ${this.selectedFile.name}`,
    });
  }

  onCancel() {
    this.submitted.emit({
      interactionId: this.interaction.id,
      action: 'cancel',
      summaryText: 'Đã hủy tải tệp lên',
    });
  }
}
