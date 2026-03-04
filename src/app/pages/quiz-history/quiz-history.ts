import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as QuizActions from '../../store/quiz/quiz.actions';
import * as QuizSelectors from '../../store/quiz/quiz.selectors';
import { QuizResult } from '../../types';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-quiz-history',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, PaginatorModule, TagModule, SkeletonModule],
  templateUrl: './quiz-history.html',
  styleUrl: './quiz-history.scss',
})
export class QuizHistoryPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private destroy$ = new Subject<void>();

  history: QuizResult[] = [];
  isLoading = false;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.store.dispatch(QuizActions.loadQuizHistory({ page: 0, size: this.pageSize }));

    this.store
      .select(QuizSelectors.selectQuizHistoryWithPagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.history = data.history;
        this.currentPage = data.page;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
      });

    this.store
      .select(QuizSelectors.selectIsLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.isLoading = loading;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PaginatorState): void {
    const page = event.page ?? 0;
    this.store.dispatch(QuizActions.loadQuizHistory({ page, size: this.pageSize }));
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  getQuizTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      multiple_choice: 'Trắc nghiệm',
      true_false: 'Đúng / Sai',
      fill_blank: 'Điền từ',
    };
    return labels[type] ?? type;
  }

  getQuizTypeSeverity(type: string): 'info' | 'warn' | 'secondary' {
    const map: Record<string, 'info' | 'warn' | 'secondary'> = {
      multiple_choice: 'info',
      true_false: 'warn',
      fill_blank: 'secondary',
    };
    return map[type] ?? 'secondary';
  }

  formatTime(seconds: number | null): string {
    if (seconds == null) return '--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getSkeletonItems(): number[] {
    return Array(5).fill(0);
  }
}
