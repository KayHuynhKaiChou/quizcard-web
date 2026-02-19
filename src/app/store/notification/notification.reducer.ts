import { createReducer, on } from '@ngrx/store';
import { NotificationState, initialNotificationState } from './notification.state';
import * as NotificationActions from './notification.actions';

export const notificationReducer = createReducer(
  initialNotificationState,

  // Load Notifications
  on(NotificationActions.loadNotifications, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    NotificationActions.loadNotificationsSuccess,
    (state, { notifications, totalPages, totalElements, page }) => ({
      ...state,
      notifications,
      totalPages,
      totalElements,
      page,
      unreadCount: notifications.filter((n) => !n.read).length,
      isLoading: false,
      error: null,
    })
  ),

  on(NotificationActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Mark As Read
  on(NotificationActions.markAsRead, (state) => ({
    ...state,
    error: null,
  })),

  on(NotificationActions.markAsReadSuccess, (state, { id }) => {
    const notification = state.notifications.find((n) => n.id === id);
    const wasUnread = notification ? !notification.read : false;
    return {
      ...state,
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    };
  }),

  on(NotificationActions.markAsReadFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
