import { Component, Input, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-usage-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai-badge" [class]="statusClass()">
      <i class="pi pi-sparkles"></i>
      <span>Còn {{ remaining() }}/{{ max() }} lượt AI hôm nay</span>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    .ai-badge {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.375rem 0.75rem; border-radius: 20px;
      font-size: 0.8125rem; font-weight: 500;
      &.green { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
      &.yellow { background: rgba(234, 179, 8, 0.15); color: #eab308; }
      &.red { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
      i { font-size: 0.875rem; }
    }
  `],
})
export class AiUsageBadge {
  remaining = input(5);
  max = input(5);

  statusClass = computed(() => {
    const r = this.remaining();
    if (r >= 3) return 'green';
    if (r >= 1) return 'yellow';
    return 'red';
  });
}
