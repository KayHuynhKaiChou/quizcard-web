import {
  Component,
  ElementRef,
  ViewChild,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent {
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;

  // Inputs
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('Nhắn tin cho QuizCard AI...');

  // Outputs
  send = output<string>();
  attachFile = output<void>();

  // State
  text = signal<string>('');

  onInput() {
    this.adjustHeight();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
  }

  handleSend() {
    const trimmed = this.text().trim();
    if (!trimmed || this.loading() || this.disabled()) {
      return;
    }

    this.send.emit(trimmed);
    this.text.set('');

    setTimeout(() => {
      if (this.textareaRef?.nativeElement) {
        this.textareaRef.nativeElement.style.height = '44px';
      }
    });
  }

  handleAttach() {
    this.attachFile.emit();
  }

  focus() {
    this.textareaRef?.nativeElement?.focus();
  }

  setValue(val: string) {
    this.text.set(val);
    setTimeout(() => {
      this.adjustHeight();
      this.focus();
    });
  }

  private adjustHeight() {
    const el = this.textareaRef?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.min(Math.max(el.scrollHeight, 44), 140);
    el.style.height = `${newHeight}px`;
  }
}
