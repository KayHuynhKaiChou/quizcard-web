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
    hasOlderMessages: false,
    hasNewerMessages: false,
    loadingOlderMessages: false,
    oldestCursor: null,
    newestCursor: null,
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
      isStreaming: true,
      streamStatus: 'Đang kết nối...',
      error: null,
      messages: [...state.messages, userMsg],
    };
  }),

  on(ChatActions.chatStreamInit, (state, { conversationId }) => ({
    ...state,
    conversationId: conversationId || state.conversationId,
  })),

  on(ChatActions.chatStreamStatus, (state, { statusText }) => ({
    ...state,
    streamStatus: statusText,
  })),

  on(ChatActions.chatStreamDelta, (state, { delta }) => {
    const msgs = [...state.messages];
    const lastMsg = msgs[msgs.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      msgs[msgs.length - 1] = {
        ...lastMsg,
        content: (lastMsg.content || '') + delta,
      };
    } else {
      msgs.push({
        role: 'assistant' as const,
        content: delta,
        createdAt: new Date().toISOString(),
      });
    }
    return {
      ...state,
      messages: msgs,
      streamStatus: null,
    };
  }),

  on(ChatActions.chatStreamInteraction, (state, { interaction }) => ({
    ...state,
    activeInteraction: interaction,
    loading: false,
    isStreaming: false,
    streamStatus: null,
  })),

  on(ChatActions.sendMessageSuccess, (state, { response }) => {
    const msgs = [...state.messages];
    const lastMsg = msgs[msgs.length - 1];

    if (response.reply) {
      if (lastMsg && lastMsg.role === 'assistant') {
        msgs[msgs.length - 1] = {
          ...lastMsg,
          content: response.reply,
        };
      } else {
        msgs.push({
          role: 'assistant' as const,
          content: response.reply,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return {
      ...state,
      loading: false,
      isStreaming: false,
      streamStatus: null,
      conversationId: response.conversationId || state.conversationId,
      messages: msgs,
      activeInteraction: response.type === 'interaction' ? response.interaction : state.activeInteraction,
    };
  }),

  on(ChatActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isStreaming: false,
    streamStatus: null,
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

  on(ChatActions.loadMessagesSuccess, (state, { conversationId, page }) => ({
    ...state,
    loading: false,
    conversationId,
    messages: (page.messages || []).map((m) => ({
      ...m,
      role: ((m.role || '').toLowerCase() as any) || 'user',
    })),
    hasOlderMessages: page.hasOlder,
    hasNewerMessages: page.hasNewer,
    oldestCursor: page.oldestCursor ?? null,
    newestCursor: page.newestCursor ?? null,
  })),

  on(ChatActions.loadOlderMessages, (state) => ({
    ...state,
    loadingOlderMessages: true,
    error: null,
  })),

  on(ChatActions.loadOlderMessagesSuccess, (state, { page }) => ({
    ...state,
    loadingOlderMessages: false,
    messages: [
      ...(page.messages || []).map((m) => ({
        ...m,
        role: ((m.role || '').toLowerCase() as any) || 'user',
      })),
      ...state.messages,
    ],
    hasOlderMessages: page.hasOlder,
    oldestCursor: page.oldestCursor ?? state.oldestCursor,
  })),

  on(ChatActions.loadOlderMessagesFailure, (state, { error }) => ({
    ...state,
    loadingOlderMessages: false,
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
