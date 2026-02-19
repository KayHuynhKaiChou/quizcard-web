import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Notification } from '../../types';
import { AppState } from '../../store/app.state';
import * as NotificationActions from '../../store/notification/notification.actions';
import * as NotificationSelectors from '../../store/notification/notification.selectors';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
})
export class NotificationsComponent implements OnInit {
  private store = inject(Store<AppState>);

  notifications$: Observable<Notification[]> = this.store.select(
    NotificationSelectors.selectAllNotifications
  );
  isLoading$: Observable<boolean> = this.store.select(NotificationSelectors.selectIsLoading);

  ngOnInit(): void {
    this.store.dispatch(NotificationActions.loadNotifications({ page: 0, size: 20 }));
  }

  markAsRead(id: string): void {
    this.store.dispatch(NotificationActions.markAsRead({ id }));
  }
}
