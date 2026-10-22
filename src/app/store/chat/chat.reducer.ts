import { createReducer, on } from '@ngrx/store';
import { initialChatState } from './chat.state';
import * as ChatActions from './chat.actions';

export const chatReducer = createReducer(
  initialChatState,

  on(ChatActions.openChat, (state) => ({ ...state, isOpen: true })),
  on(ChatActions.closeChat, (state) => ({ ...state, isOpen: false })),
  on(ChatActions.toggleChat, (state) => ({ ...state, isOpen: !state.isOpen })),

  on(ChatActions.newChat, (state) => ({
    ...state,
    conversationId: null,
    messages: [],
    activeInteraction: null,
    error: null,
  })),

  on(ChatActions.sendMessage, (state, { message }) => {
    const userMsg = {
      role: 'user' as const,
      content: message,
      createdAt: new Date().toISOString(),
    };
    return {
      ...state,
      loading: true,
      error: null,
      messages: [...state.messages, userMsg],
    };
  }),

  on(ChatActions.sendMessageSuccess, (state, { response }) => {
    const newMessages = [...state.messages];
    if (response.reply) {
      newMessages.push({
        role: 'assistant' as const,
        content: response.reply,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      ...state,
      loading: false,
      conversationId: response.conversationId || state.conversationId,
      messages: newMessages,
      activeInteraction: response.type === 'interaction' ? response.interaction : null,
    };
  }),

  on(ChatActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ChatActions.submitInteraction, (state, { summaryText }) => {
    const newMessages = [...state.messages];
    if (summaryText) {
      newMessages.push({
        role: 'user' as const,
        content: summaryText,
        createdAt: new Date().toISOString(),
      });
    }
    return {
      ...state,
      loading: true,
      error: null,
      activeInteraction: null,
      messages: newMessages,
    };
  }),

  on(ChatActions.submitInteractionSuccess, (state, { response }) => {
    const newMessages = [...state.messages];
    if (response.reply) {
      newMessages.push({
        role: 'assistant' as const,
        content: response.reply,
        createdAt: new Date().toISOString(),
      });
    }
    return {
      ...state,
      loading: false,
      conversationId: response.conversationId || state.conversationId,
      messages: newMessages,
      activeInteraction: response.type === 'interaction' ? response.interaction : null,
    };
  }),

  on(ChatActions.submitInteractionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ChatActions.loadConversationsSuccess, (state, { conversations }) => ({
    ...state,
    conversations,
  })),

  on(ChatActions.selectConversation, (state, { conversationId }) => ({
    ...state,
    loading: true,
    conversationId,
    activeInteraction: null,
  })),

  on(ChatActions.loadMessagesSuccess, (state, { conversationId, messages }) => ({
    ...state,
    loading: false,
    conversationId,
    messages,
  })),

  on(ChatActions.loadMessagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ChatActions.deleteConversationSuccess, (state, { conversationId }) => {
    const isCurrent = state.conversationId === conversationId;
    return {
      ...state,
      conversations: state.conversations.filter((c) => c.id !== conversationId),
      conversationId: isCurrent ? null : state.conversationId,
      messages: isCurrent ? [] : state.messages,
      activeInteraction: isCurrent ? null : state.activeInteraction,
    };
  }),

  on(ChatActions.clearActiveInteraction, (state) => ({
    ...state,
    activeInteraction: null,
  }))
);
