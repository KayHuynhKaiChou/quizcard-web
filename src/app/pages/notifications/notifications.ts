import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem;">
      <h1 style="color: white; margin-bottom: 1rem;">Thông báo</h1>
      <p style="color: rgba(255, 255, 255, 0.6);">Danh sách thông báo sẽ được hiển thị ở đây...</p>
    </div>
  `
})
export class NotificationsComponent {}
