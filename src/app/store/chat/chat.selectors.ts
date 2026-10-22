import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.state';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectIsOpen = createSelector(
  selectChatState,
  (state) => state?.isOpen ?? false
);

export const selectConversationId = createSelector(
  selectChatState,
  (state) => state?.conversationId ?? null
);

export const selectChatMessages = createSelector(
  selectChatState,
  (state) => state?.messages ?? []
);

export const selectActiveInteraction = createSelector(
  selectChatState,
  (state) => state?.activeInteraction ?? null
);

export const selectChatLoading = createSelector(
  selectChatState,
  (state) => state?.loading ?? false
);

export const selectChatError = createSelector(
  selectChatState,
  (state) => state?.error ?? null
);

export const selectChatConversations = createSelector(
  selectChatState,
  (state) => state?.conversations ?? []
);
