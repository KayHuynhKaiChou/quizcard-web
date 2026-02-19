import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <i [class]="'pi ' + icon"></i>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      @if (message) {
        <p class="empty-message">{{ message }}</p>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 3rem 1.5rem; text-align: center;
    }
    .empty-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.25rem;
      i { font-size: 2rem; color: $text-secondary; }
    }
    .empty-title { font-size: 1.125rem; font-weight: 600; color: $text-primary; margin: 0 0 0.5rem; }
    .empty-message { font-size: 0.875rem; color: $text-secondary; margin: 0; max-width: 320px; line-height: 1.5; }
  `],
})
export class EmptyState {
  @Input() icon = 'pi-inbox';
  @Input() title = 'Không có dữ liệu';
  @Input() message = '';
}
