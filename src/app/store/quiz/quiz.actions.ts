import { createAction, props } from '@ngrx/store';
import { QuizConfigRequest, QuizResult, QuizResultDetail, QuizSubmitRequest } from '../../types';

// Generate Quiz Actions
export const generateQuiz = createAction('[Quiz] Generate Quiz', props<QuizConfigRequest>());

export const generateQuizSuccess = createAction(
  '[Quiz] Generate Quiz Success',
  props<{ quiz: any }>()
);

export const generateQuizFailure = createAction(
  '[Quiz] Generate Quiz Failure',
  props<{ error: string }>()
);

// Submit Quiz Actions
export const submitQuiz = createAction('[Quiz] Submit Quiz', props<QuizSubmitRequest>());

export const submitQuizSuccess = createAction(
  '[Quiz] Submit Quiz Success',
  props<{ result: any }>()
);

export const submitQuizFailure = createAction(
  '[Quiz] Submit Quiz Failure',
  props<{ error: string }>()
);

// Load Quiz History Actions
export const loadQuizHistory = createAction(
  '[Quiz] Load Quiz History',
  props<{ page?: number; size?: number }>()
);

export const loadQuizHistorySuccess = createAction(
  '[Quiz] Load Quiz History Success',
  props<{ history: QuizResult[]; totalPages: number; totalElements: number; page: number }>()
);

export const loadQuizHistoryFailure = createAction(
  '[Quiz] Load Quiz History Failure',
  props<{ error: string }>()
);

// Load Quiz Result Detail Actions
export const loadQuizResultDetail = createAction(
  '[Quiz] Load Quiz Result Detail',
  props<{ id: string }>()
);

export const loadQuizResultDetailSuccess = createAction(
  '[Quiz] Load Quiz Result Detail Success',
  props<{ result: QuizResultDetail }>()
);

export const loadQuizResultDetailFailure = createAction(
  '[Quiz] Load Quiz Result Detail Failure',
  props<{ error: string }>()
);

export const clearSelectedResult = createAction('[Quiz] Clear Selected Result');

// Utility Actions
export const clearCurrentQuiz = createAction('[Quiz] Clear Current Quiz');
