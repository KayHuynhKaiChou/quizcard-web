import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuizState } from './quiz.state';

export const selectQuizState = createFeatureSelector<QuizState>('quiz');

export const selectCurrentQuiz = createSelector(selectQuizState, (state) => state.currentQuiz);

export const selectQuizHistory = createSelector(selectQuizState, (state) => state.history);

export const selectIsLoading = createSelector(selectQuizState, (state) => state.isLoading);

export const selectError = createSelector(selectQuizState, (state) => state.error);

export const selectQuizPage = createSelector(selectQuizState, (state) => state.page);

export const selectQuizTotalPages = createSelector(selectQuizState, (state) => state.totalPages);

export const selectQuizTotalElements = createSelector(
  selectQuizState,
  (state) => state.totalElements
);
