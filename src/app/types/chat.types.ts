export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'tool';
  content?: string;
  createdAt?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormField {
  name: string;
  type: 'text' | 'select' | 'number' | 'textarea' | 'boolean';
  label: string;
  required?: boolean;
  default?: any;
  options?: string[];
}

export interface FormInteraction {
  type: 'form';
  id: string;
  title: string;
  fields: FormField[];
}

export interface TermPickerItem {
  key: string;
  term: string;
  definition: string;
  ipa?: string;
  example?: string;
  checked: boolean;
  alreadyOwned?: boolean;
}

export interface TermPickerInteraction {
  type: 'term_picker';
  id: string;
  title: string;
  terms: TermPickerItem[];
  allowEdit?: boolean;
}

export interface ConfirmInteraction {
  type: 'confirm';
  id: string;
  summary: string;
  danger?: boolean;
  details?: any;
}

export interface FileRequestInteraction {
  type: 'file_request';
  id: string;
  title?: string;
  accept?: string[];
  maxSizeMb?: number;
}

export type ChatInteraction =
  | FormInteraction
  | TermPickerInteraction
  | ConfirmInteraction
  | FileRequestInteraction;

export interface ChatResponse {
  type: 'final' | 'interaction';
  conversationId: string;
  reply?: string;
  actions?: string[];
  interaction?: any;
}

export interface SendMessageRequest {
  message: string;
  conversationId?: string;
}

export interface InteractionSubmitRequest {
  interactionId: string;
  action: 'submit' | 'cancel';
  data?: any;
}
