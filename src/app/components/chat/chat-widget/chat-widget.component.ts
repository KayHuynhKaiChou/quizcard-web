import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  effect,
  PLATFORM_ID,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { environment } from '../../../../environments/environment';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors';
import * as ChatActions from '../../../store/chat/chat.actions';
import {
  selectIsOpen,
  selectChatMessages,
  selectActiveInteraction,
  selectChatLoading,
  selectChatConversations,
  selectConversationId,
} from '../../../store/chat/chat.selectors';

import { ChatFormComponent } from '../chat-form/chat-form.component';
import { ChatTermPickerComponent } from '../chat-term-picker/chat-term-picker.component';
import { ChatConfirmComponent } from '../chat-confirm/chat-confirm.component';
import { ChatFileRequestComponent } from '../chat-file-request/chat-file-request.component';
import {
  ChatInteraction,
  ConfirmInteraction,
  FileRequestInteraction,
  FormInteraction,
  TermPickerInteraction,
} from '../../../types';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DrawerModule,
    ButtonModule,
    TooltipModule,
    ChatFormComponent,
    ChatTermPickerComponent,
    ChatConfirmComponent,
    ChatFileRequestComponent,
  ],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
})
export class ChatWidgetComponent implements AfterViewChecked {
  private store = inject(Store);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;

  readonly chatEnabled = environment.chatEnabled ?? false;
  readonly isBrowser = isPlatformBrowser(this.platformId);

  // Store signals
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly isOpen = this.store.selectSignal(selectIsOpen);
  readonly messages = this.store.selectSignal(selectChatMessages);
  readonly activeInteraction = this.store.selectSignal(selectActiveInteraction);
  readonly loading = this.store.selectSignal(selectChatLoading);
  readonly conversations = this.store.selectSignal(selectChatConversations);
  readonly currentConversationId = this.store.selectSignal(selectConversationId);

  // Local UI state
  inputMessage = signal<string>('');
  showHistory = signal<boolean>(false);
  private shouldScrollBottom = false;

  constructor() {
    // When messages change, schedule auto-scroll
    effect(() => {
      this.messages();
      this.shouldScrollBottom = true;
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollBottom) {
      this.scrollToBottom();
      this.shouldScrollBottom = false;
    }
  }

  toggleWidget() {
    this.store.dispatch(ChatActions.toggleChat());
    if (!this.isOpen() && this.conversations().length === 0) {
      this.store.dispatch(ChatActions.loadConversations());
    }
  }

  closeWidget() {
    this.store.dispatch(ChatActions.closeChat());
  }

  startNewChat() {
    this.store.dispatch(ChatActions.newChat());
    this.showHistory.set(false);
  }

  toggleHistory() {
    this.showHistory.update((v) => !v);
    if (this.showHistory()) {
      this.store.dispatch(ChatActions.loadConversations());
    }
  }

  selectConversation(convId: string) {
    this.store.dispatch(ChatActions.selectConversation({ conversationId: convId }));
    this.showHistory.set(false);
  }

  deleteConversation(event: Event, convId: string) {
    event.stopPropagation();
    this.store.dispatch(ChatActions.deleteConversation({ conversationId: convId }));
  }

  sendMessage() {
    const text = this.inputMessage().trim();
    if (!text || this.loading()) return;

    this.store.dispatch(ChatActions.sendMessage({ message: text }));
    this.inputMessage.set('');
    this.shouldScrollBottom = true;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  handleInteractionSubmit(event: {
    interactionId: string;
    action: 'submit' | 'cancel';
    data?: any;
    summaryText?: string;
  }) {
    this.store.dispatch(ChatActions.submitInteraction(event));
    this.shouldScrollBottom = true;
  }

  sendQuickPrompt(promptText: string) {
    this.inputMessage.set(promptText);
    this.sendMessage();
  }

  private scrollToBottom() {
    if (this.messagesContainer?.nativeElement) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  // Type guards for templates
  asForm(interaction: ChatInteraction): FormInteraction {
    return interaction as FormInteraction;
  }

  asTermPicker(interaction: ChatInteraction): TermPickerInteraction {
    return interaction as TermPickerInteraction;
  }

  asConfirm(interaction: ChatInteraction): ConfirmInteraction {
    return interaction as ConfirmInteraction;
  }

  asFileRequest(interaction: ChatInteraction): FileRequestInteraction {
    return interaction as FileRequestInteraction;
  }
}
