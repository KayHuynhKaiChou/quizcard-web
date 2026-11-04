import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ChatMessage,
  ChatCursorPage,
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

  sendMessageStream(
    message: string,
    conversationId?: string
  ): Observable<{ event: string; data: any }> {
    return new Observable((subscriber) => {
      const controller = new AbortController();
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload: { message: string; conversationId?: string } = { message };
      if (conversationId) {
        payload.conversationId = conversationId;
      }

      fetch(`${this.API}/chat/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || `HTTP error ${response.status}`);
          }
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No readable stream returned by server');
          }
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
              const lines = part.split('\n');
              let event = 'message';
              let dataStr = '';
              for (const line of lines) {
                if (line.startsWith('event:')) {
                  event = line.substring(6).trim();
                } else if (line.startsWith('data:')) {
                  dataStr = line.substring(5).trim();
                }
              }
              if (dataStr) {
                try {
                  const data = JSON.parse(dataStr);
                  subscriber.next({ event, data });
                } catch {
                  subscriber.next({ event, data: dataStr });
                }
              }
            }
          }
          subscriber.complete();
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            subscriber.error(err);
          }
        });

      return () => {
        controller.abort();
      };
    });
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

  getMessages(
    conversationId: string,
    options?: { before?: string; after?: string; limit?: number }
  ): Observable<ChatCursorPage> {
    let params = new HttpParams();
    if (options?.before) {
      params = params.set('before', options.before);
    }
    if (options?.after) {
      params = params.set('after', options.after);
    }
    if (options?.limit) {
      params = params.set('limit', options.limit);
    }
    return this.http.get<ChatCursorPage>(
      `${this.API}/chat/conversations/${conversationId}/messages`,
      { params }
    );
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
