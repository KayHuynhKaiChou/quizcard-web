import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as QuizActions from '../../store/quiz/quiz.actions';
import * as QuizSelectors from '../../store/quiz/quiz.selectors';
import { QuizResultDetail, QuizAnswerDetail } from '../../types';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-quiz-result-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TagModule, SkeletonModule],
  templateUrl: './quiz-result-detail.html',
  styleUrl: './quiz-result-detail.scss',
})
export class QuizResultDetailPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  result: QuizResultDetail | null = null;
  isLoading = false;
  correctAnswers: QuizAnswerDetail[] = [];
  wrongAnswers: QuizAnswerDetail[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(QuizActions.loadQuizResultDetail({ id }));
    }

    this.store
      .select(QuizSelectors.selectSelectedResult)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.result = result;
        if (result) {
          this.correctAnswers = result.answers.filter((a) => a.correct);
          this.wrongAnswers = result.answers.filter((a) => !a.correct);
        }
      });

    this.store
      .select(QuizSelectors.selectIsLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (this.isLoading = loading));
  }

  ngOnDestroy(): void {
    this.store.dispatch(QuizActions.clearSelectedResult());
    this.destroy$.next();
    this.destroy$.complete();
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
    return Array(3).fill(0);
  }

  goBack(): void {
    this.router.navigate(['/quiz-history']);
  }
}
