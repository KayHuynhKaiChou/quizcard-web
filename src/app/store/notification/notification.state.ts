import { Notification } from '../../types';

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  unreadCount: number;
}

export const initialNotificationState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
  page: 0,
  totalPages: 0,
  totalElements: 0,
  unreadCount: 0,
};
