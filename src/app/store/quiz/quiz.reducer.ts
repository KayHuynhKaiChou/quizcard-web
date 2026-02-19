import { createReducer, on } from '@ngrx/store';
import { QuizState, initialQuizState } from './quiz.state';
import * as QuizActions from './quiz.actions';

export const quizReducer = createReducer(
  initialQuizState,

  // Generate Quiz
  on(QuizActions.generateQuiz, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(QuizActions.generateQuizSuccess, (state, { quiz }) => ({
    ...state,
    currentQuiz: quiz,
    isLoading: false,
    error: null,
  })),

  on(QuizActions.generateQuizFailure, (state, { error }) => ({
    ...state,
    currentQuiz: null,
    isLoading: false,
    error,
  })),

  // Submit Quiz
  on(QuizActions.submitQuiz, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(QuizActions.submitQuizSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(QuizActions.submitQuizFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Load Quiz History
  on(QuizActions.loadQuizHistory, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(QuizActions.loadQuizHistorySuccess, (state, { history, totalPages, totalElements, page }) => ({
    ...state,
    history,
    totalPages,
    totalElements,
    page,
    isLoading: false,
    error: null,
  })),

  on(QuizActions.loadQuizHistoryFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Utility
  on(QuizActions.clearCurrentQuiz, (state) => ({
    ...state,
    currentQuiz: null,
  }))
);
