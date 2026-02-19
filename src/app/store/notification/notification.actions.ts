import { createAction, props } from '@ngrx/store';
import { Notification } from '../../types';

// Load Notifications (paginated)
export const loadNotifications = createAction(
  '[Notification] Load Notifications',
  props<{ page?: number; size?: number }>()
);

export const loadNotificationsSuccess = createAction(
  '[Notification] Load Notifications Success',
  props<{
    notifications: Notification[];
    totalPages: number;
    totalElements: number;
    page: number;
  }>()
);

export const loadNotificationsFailure = createAction(
  '[Notification] Load Notifications Failure',
  props<{ error: string }>()
);

// Mark As Read
export const markAsRead = createAction(
  '[Notification] Mark As Read',
  props<{ id: string }>()
);

export const markAsReadSuccess = createAction(
  '[Notification] Mark As Read Success',
  props<{ id: string }>()
);

export const markAsReadFailure = createAction(
  '[Notification] Mark As Read Failure',
  props<{ error: string }>()
);
