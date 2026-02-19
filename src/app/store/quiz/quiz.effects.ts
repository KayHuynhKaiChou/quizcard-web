import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as QuizActions from './quiz.actions';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { Page, QuizResult } from '../../types';

@Injectable()
export class QuizEffects {
  private readonly API = environment.apiUrl;

  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);

  // Generate Quiz Effect
  generateQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.generateQuiz),
      tap(() => this.loadingService.show('Đang tạo bài kiểm tra...')),
      switchMap((request) => {
        const { type: _type, ...body } = request as any;
        return this.http.post<any>(`${this.API}/quiz/generate`, body).pipe(
          map((quiz) => QuizActions.generateQuizSuccess({ quiz })),
          catchError((error) =>
            of(
              QuizActions.generateQuizFailure({
                error: error.error?.message || 'Tạo bài kiểm tra thất bại',
              })
            )
          ),
          finalize(() => this.loadingService.hide())
        );
      })
    )
  );

  // Submit Quiz Effect
  submitQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.submitQuiz),
      tap(() => this.loadingService.show('Đang nộp bài...')),
      switchMap((request) => {
        const { type: _type, ...body } = request as any;
        return this.http.post<any>(`${this.API}/quiz/submit`, body).pipe(
          map((result) => QuizActions.submitQuizSuccess({ result })),
          catchError((error) =>
            of(
              QuizActions.submitQuizFailure({
                error: error.error?.message || 'Nộp bài thất bại',
              })
            )
          ),
          finalize(() => this.loadingService.hide())
        );
      })
    )
  );

  // Load Quiz History Effect
  loadQuizHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.loadQuizHistory),
      tap(() => this.loadingService.show('Đang tải lịch sử...')),
      switchMap(({ page = 0, size = 10 }) => {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
        return this.http.get<Page<QuizResult>>(`${this.API}/quiz/history`, { params }).pipe(
          map((response) =>
            QuizActions.loadQuizHistorySuccess({
              history: response.content,
              totalPages: response.totalPages,
              totalElements: response.totalElements,
              page: response.number,
            })
          ),
          catchError((error) =>
            of(
              QuizActions.loadQuizHistoryFailure({
                error: error.error?.message || 'Tải lịch sử thất bại',
              })
            )
          ),
          finalize(() => this.loadingService.hide())
        );
      })
    )
  );

  // Side-effect: toast on submit success
  submitQuizSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(QuizActions.submitQuizSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Nộp bài thành công',
            detail: 'Kết quả của bạn đã được lưu.',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  // Side-effect: toast on generate failure
  generateQuizFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(QuizActions.generateQuizFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Tạo bài kiểm tra thất bại',
            detail: error,
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  // Side-effect: toast on submit failure
  submitQuizFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(QuizActions.submitQuizFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Nộp bài thất bại',
            detail: error,
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );
}
