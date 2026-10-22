import { createAction, props } from '@ngrx/store';
import {
  ChatMessage,
  ChatConversation,
  ChatResponse,
} from '../../types';

// Widget UI visibility
export const openChat = createAction('[Chat] Open Chat');
export const closeChat = createAction('[Chat] Close Chat');
export const toggleChat = createAction('[Chat] Toggle Chat');

// Start fresh chat
export const newChat = createAction('[Chat] New Chat');

// Send regular message
export const sendMessage = createAction(
  '[Chat] Send Message',
  props<{ message: string }>()
);
export const sendMessageSuccess = createAction(
  '[Chat] Send Message Success',
  props<{ response: ChatResponse }>()
);
export const sendMessageFailure = createAction(
  '[Chat] Send Message Failure',
  props<{ error: string }>()
);

// Submit interaction (form, term picker, confirm)
export const submitInteraction = createAction(
  '[Chat] Submit Interaction',
  props<{ interactionId: string; action: 'submit' | 'cancel'; data?: any; summaryText?: string }>()
);
export const submitInteractionSuccess = createAction(
  '[Chat] Submit Interaction Success',
  props<{ response: ChatResponse }>()
);
export const submitInteractionFailure = createAction(
  '[Chat] Submit Interaction Failure',
  props<{ error: string }>()
);

// Load conversation list
export const loadConversations = createAction('[Chat] Load Conversations');
export const loadConversationsSuccess = createAction(
  '[Chat] Load Conversations Success',
  props<{ conversations: ChatConversation[] }>()
);
export const loadConversationsFailure = createAction(
  '[Chat] Load Conversations Failure',
  props<{ error: string }>()
);

// Select conversation & load messages
export const selectConversation = createAction(
  '[Chat] Select Conversation',
  props<{ conversationId: string }>()
);
export const loadMessagesSuccess = createAction(
  '[Chat] Load Messages Success',
  props<{ conversationId: string; messages: ChatMessage[] }>()
);
export const loadMessagesFailure = createAction(
  '[Chat] Load Messages Failure',
  props<{ error: string }>()
);

// Delete conversation
export const deleteConversation = createAction(
  '[Chat] Delete Conversation',
  props<{ conversationId: string }>()
);
export const deleteConversationSuccess = createAction(
  '[Chat] Delete Conversation Success',
  props<{ conversationId: string }>()
);

// Clear active interaction
export const clearActiveInteraction = createAction(
  '[Chat] Clear Active Interaction'
);
