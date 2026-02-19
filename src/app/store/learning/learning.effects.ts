import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as LearningActions from './learning.actions';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { LearningStats, ReviewRequest, ReviewTerm } from '../../types';

@Injectable()
export class LearningEffects {
  private readonly API = environment.apiUrl;

  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);

  loadTodayReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LearningActions.loadTodayReview),
      tap(() => this.loadingService.show()),
      switchMap(() =>
        this.http.get<ReviewTerm[]>(`${this.API}/learning/today`).pipe(
          map((terms) => LearningActions.loadTodayReviewSuccess({ terms })),
          catchError((error) =>
            of(
              LearningActions.loadTodayReviewFailure({
                error: error.error?.message || 'Tải danh sách ôn tập thất bại',
              })
            )
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  submitReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LearningActions.submitReview),
      switchMap(({ termId, quality }) => {
        const body: ReviewRequest = { termId, quality };
        return this.http.post<any>(`${this.API}/learning/review`, body).pipe(
          map((result) => LearningActions.submitReviewSuccess({ result })),
          catchError((error) =>
            of(
              LearningActions.submitReviewFailure({
                error: error.error?.message || 'Gửi kết quả ôn tập thất bại',
              })
            )
          )
        );
      })
    )
  );

  submitReviewSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LearningActions.submitReviewSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Ôn tập thành công',
            detail: 'Tiến độ của bạn đã được cập nhật.',
            life: 2000,
          });
        })
      ),
    { dispatch: false }
  );

  submitReviewFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LearningActions.submitReviewFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error || 'Gửi kết quả ôn tập thất bại',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  loadLearningStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LearningActions.loadLearningStats),
      switchMap(() =>
        this.http.get<LearningStats>(`${this.API}/learning/stats`).pipe(
          map((stats) => LearningActions.loadLearningStatsSuccess({ stats })),
          catchError((error) =>
            of(
              LearningActions.loadLearningStatsFailure({
                error: error.error?.message || 'Tải thống kê thất bại',
              })
            )
          )
        )
      )
    )
  );
}
