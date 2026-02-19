import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notification.state';

export const selectNotificationState =
  createFeatureSelector<NotificationState>('notification');

export const selectAllNotifications = createSelector(
  selectNotificationState,
  (state) => state.notifications
);

export const selectUnreadCount = createSelector(
  selectNotificationState,
  (state) => state.unreadCount
);

export const selectIsLoading = createSelector(
  selectNotificationState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectNotificationState,
  (state) => state.error
);

export const selectUnreadNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter((n) => !n.read)
);
