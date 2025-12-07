import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem;">
      <h1 style="color: white; margin-bottom: 1rem;">Trang chủ</h1>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
        <div *ngFor="let card of cards" class="content-card">
          <div class="card-icon">📚</div>
          <h3 class="card-title">{{ card.title }}</h3>
          <div class="card-info">
            <span>{{ card.terms }} thuật ngữ</span>
          </div>
          <div class="card-info">
            <span>Tác giả: {{ card.author }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-card {
      background: linear-gradient(135deg, #2a4d7a 0%, #1e3a5f 100%);
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        border-color: rgba(76, 175, 80, 0.3);
      }

      .card-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      .card-title {
        color: white;
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .card-info {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }
    }
  `]
})
export class DashboardPage {
  cards = [
    { title: 'TOEIC vocabulary', terms: '500', author: 'Huyen0996' },
    { title: 'từ vựng tiếng anh', terms: '200', author: 'bạn' },
    { title: 'Kayhuyn IELTS Part 1', terms: '150', author: 'bạn' },
    { title: 'Kayhuyn IELTS practice', terms: '300', author: 'Huyen0996' }
  ];
}

