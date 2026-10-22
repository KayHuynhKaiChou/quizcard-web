import { ChatMessage, ChatConversation, ChatInteraction } from '../../types';

export interface ChatState {
  conversationId: string | null;
  messages: ChatMessage[];
  conversations: ChatConversation[];
  activeInteraction: ChatInteraction | null;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

export const initialChatState: ChatState = {
  conversationId: null,
  messages: [],
  conversations: [],
  activeInteraction: null,
  loading: false,
  error: null,
  isOpen: false,
};
