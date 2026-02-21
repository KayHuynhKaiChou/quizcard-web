import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as NotificationActions from './notification.actions';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { Notification, Page } from '../../types';

@Injectable()
export class NotificationEffects {
  private readonly API = environment.apiUrl;

  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      tap(() => this.loadingService.show('Đang tải thông báo...')),
      switchMap(({ page, size }) => {
        let params = new HttpParams();
        if (page !== undefined) {
          params = params.set('page', page.toString());
        }
        if (size !== undefined) {
          params = params.set('size', size.toString());
        }
        return this.http
          .get<Page<Notification>>(`${this.API}/notifications`, { params })
          .pipe(
            map((response) =>
              NotificationActions.loadNotificationsSuccess({
                notifications: response.content,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                page: response.number,
              })
            ),
            catchError((error) =>
              of(
                NotificationActions.loadNotificationsFailure({
                  error: error.error?.message || 'Tải thông báo thất bại',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          );
      })
    )
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAsRead),
      switchMap(({ id }) =>
        this.http.put<void>(`${this.API}/notifications/${id}/read`, null).pipe(
          map(() => NotificationActions.markAsReadSuccess({ id })),
          catchError((error) =>
            of(
              NotificationActions.markAsReadFailure({
                error: error.error?.message || 'Đánh dấu đã đọc thất bại',
              })
            )
          )
        )
      )
    )
  );

  markAsReadFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationActions.markAsReadFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error,
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );
}
