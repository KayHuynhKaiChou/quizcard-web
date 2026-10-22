import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import * as ChatActions from './chat.actions';
import { selectConversationId } from './chat.selectors';
import { ChatService } from '../../services/chat.service';
import * as StudySetActions from '../studyset/studyset.actions';

@Injectable()
export class ChatEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private chatService = inject(ChatService);

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      withLatestFrom(this.store.select(selectConversationId)),
      switchMap(([action, conversationId]) =>
        this.chatService.sendMessage(action.message, conversationId || undefined).pipe(
          switchMap((response) => {
            const actions: any[] = [ChatActions.sendMessageSuccess({ response })];
            if (response.actions?.includes('REFRESH_STUDY_SETS')) {
              actions.push(StudySetActions.loadStudySets({ page: 0, size: 20 }));
            }
            return actions;
          }),
          catchError((error) =>
            of(
              ChatActions.sendMessageFailure({
                error: error.error?.message || error.message || 'Không thể gửi tin nhắn',
              })
            )
          )
        )
      )
    )
  );

  submitInteraction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.submitInteraction),
      switchMap((action) =>
        this.chatService
          .submitInteraction(action.interactionId, action.action, action.data)
          .pipe(
            switchMap((response) => {
              const actions: any[] = [ChatActions.submitInteractionSuccess({ response })];
              if (response.actions?.includes('REFRESH_STUDY_SETS')) {
                actions.push(StudySetActions.loadStudySets({ page: 0, size: 20 }));
              }
              return actions;
            }),
            catchError((error) =>
              of(
                ChatActions.submitInteractionFailure({
                  error: error.error?.message || error.message || 'Không thể xử lý tương tác',
                })
              )
            )
          )
      )
    )
  );

  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadConversations),
      switchMap(() =>
        this.chatService.getConversations().pipe(
          map((page) => ChatActions.loadConversationsSuccess({ conversations: page.content })),
          catchError((error) =>
            of(ChatActions.loadConversationsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  selectConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.selectConversation),
      switchMap(({ conversationId }) =>
        this.chatService.getMessages(conversationId).pipe(
          map((page) =>
            ChatActions.loadMessagesSuccess({ conversationId, page })
          ),
          catchError((error) =>
            of(ChatActions.loadMessagesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadOlderMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadOlderMessages),
      switchMap(({ conversationId, before }) =>
        this.chatService.getMessages(conversationId, { before }).pipe(
          map((page) =>
            ChatActions.loadOlderMessagesSuccess({ conversationId, page })
          ),
          catchError((error) =>
            of(ChatActions.loadOlderMessagesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.deleteConversation),
      switchMap(({ conversationId }) =>
        this.chatService.deleteConversation(conversationId).pipe(
          map(() => ChatActions.deleteConversationSuccess({ conversationId })),
          catchError((error) =>
            of(ChatActions.sendMessageFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
