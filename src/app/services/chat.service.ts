import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ChatMessage,
  ChatConversation,
  ChatResponse,
  Page,
} from '../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly API = environment.apiUrl;
  private http = inject(HttpClient);

  sendMessage(message: string, conversationId?: string): Observable<ChatResponse> {
    const payload: { message: string; conversationId?: string } = { message };
    if (conversationId) {
      payload.conversationId = conversationId;
    }
    return this.http.post<ChatResponse>(`${this.API}/chat`, payload);
  }

  submitInteraction(
    interactionId: string,
    action: 'submit' | 'cancel',
    data?: any
  ): Observable<ChatResponse> {
    const payload = {
      interactionId,
      action,
      data: data || {},
    };
    return this.http.post<ChatResponse>(`${this.API}/chat/interaction`, payload);
  }

  getConversations(page = 0, size = 20): Observable<Page<ChatConversation>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<ChatConversation>>(`${this.API}/chat/conversations`, { params });
  }

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.API}/chat/conversations/${conversationId}/messages`);
  }

  deleteConversation(conversationId: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/chat/conversations/${conversationId}`);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.API}/chat/upload`, formData);
  }
}
