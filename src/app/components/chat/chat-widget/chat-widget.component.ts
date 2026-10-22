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
import { TextFieldModule } from '@angular/cdk/text-field';
import { Store } from '@ngrx/store';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { environment } from '../../../../environments/environment';
import { MarkdownPipe } from '../../../pipes/markdown.pipe';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors';
import * as ChatActions from '../../../store/chat/chat.actions';
import {
  selectIsOpen,
  selectChatMessages,
  selectActiveInteraction,
  selectChatLoading,
  selectChatConversations,
  selectConversationId,
  selectHasOlderMessages,
  selectLoadingOlderMessages,
  selectOldestCursor,
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
    TextFieldModule,
    DrawerModule,
    ButtonModule,
    TooltipModule,
    MarkdownPipe,
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
  readonly hasOlder = this.store.selectSignal(selectHasOlderMessages);
  readonly loadingOlder = this.store.selectSignal(selectLoadingOlderMessages);
  readonly oldestCursor = this.store.selectSignal(selectOldestCursor);

  // Local UI state
  inputMessage = signal<string>('');
  showHistory = signal<boolean>(false);
  showScrollBottomBtn = signal<boolean>(false);
  unreadWhileScrolledUp = signal<number>(0);

  private shouldScrollBottom = false;
  private isPrependingMessages = false;
  private prevScrollHeight = 0;
  private prevScrollTop = 0;

  constructor() {
    // When messages change, schedule auto-scroll if near bottom
    effect(() => {
      this.messages();
      if (this.showScrollBottomBtn()) {
        this.unreadWhileScrolledUp.update((n) => n + 1);
      } else {
        this.shouldScrollBottom = true;
      }
    });
  }

  ngAfterViewChecked() {
    if (this.isPrependingMessages && this.messagesContainer?.nativeElement) {
      const el = this.messagesContainer.nativeElement;
      const heightDiff = el.scrollHeight - this.prevScrollHeight;
      el.scrollTop = this.prevScrollTop + heightDiff;
      this.isPrependingMessages = false;
    } else if (this.shouldScrollBottom) {
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
    this.showScrollBottomBtn.set(false);
    this.unreadWhileScrolledUp.set(0);
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
    this.showScrollBottomBtn.set(false);
    this.unreadWhileScrolledUp.set(0);
    this.shouldScrollBottom = true;
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
    this.showScrollBottomBtn.set(false);
    this.unreadWhileScrolledUp.set(0);
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
    this.showScrollBottomBtn.set(false);
    this.unreadWhileScrolledUp.set(0);
    this.shouldScrollBottom = true;
  }

  sendQuickPrompt(promptText: string) {
    this.inputMessage.set(promptText);
    this.sendMessage();
  }

  onScroll() {
    if (!this.messagesContainer?.nativeElement) return;
    const el = this.messagesContainer.nativeElement;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isUp = distanceFromBottom > 150;
    this.showScrollBottomBtn.set(isUp);
    if (!isUp) {
      this.unreadWhileScrolledUp.set(0);
    }

    // Auto load older messages when near top
    if (el.scrollTop <= 40 && this.hasOlder() && !this.loadingOlder()) {
      this.triggerLoadOlder();
    }
  }

  triggerLoadOlder() {
    const convId = this.currentConversationId();
    const cursor = this.oldestCursor();
    if (convId && cursor && !this.loadingOlder()) {
      if (this.messagesContainer?.nativeElement) {
        const el = this.messagesContainer.nativeElement;
        this.isPrependingMessages = true;
        this.prevScrollHeight = el.scrollHeight;
        this.prevScrollTop = el.scrollTop;
      }
      this.store.dispatch(ChatActions.loadOlderMessages({ conversationId: convId, before: cursor }));
    }
  }

  scrollToBottomSmooth() {
    if (this.messagesContainer?.nativeElement) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      this.showScrollBottomBtn.set(false);
      this.unreadWhileScrolledUp.set(0);
    }
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
