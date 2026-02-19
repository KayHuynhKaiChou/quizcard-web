import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card" [style.--accent]="color">
      <div class="stats-icon">
        <i [class]="'pi ' + icon"></i>
      </div>
      <div class="stats-info">
        <div class="stats-value">{{ value }}</div>
        <div class="stats-label">{{ label }}</div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    .stats-card {
      display: flex; align-items: center; gap: 1rem;
      background: $bg-card; border: 1px solid $border-color;
      border-radius: $radius-card; padding: 1rem 1.25rem;
      transition: transform 0.2s;
      &:hover { transform: translateY(-2px); }
    }
    .stats-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: rgba(var(--accent-rgb, 34, 197, 94), 0.15);
      display: flex; align-items: center; justify-content: center;
      i { font-size: 1.25rem; color: var(--accent, #{$accent-color}); }
    }
    .stats-value { font-size: 1.5rem; font-weight: 700; color: $text-primary; }
    .stats-label { font-size: 0.8125rem; color: $text-secondary; margin-top: 2px; }
  `],
})
export class StatsCard {
  @Input() icon = '';
  @Input() value: string | number = '';
  @Input() label = '';
  @Input() color = '';
}
