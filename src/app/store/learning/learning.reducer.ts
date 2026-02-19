import { createReducer, on } from '@ngrx/store';
import { LearningState, initialLearningState } from './learning.state';
import * as LearningActions from './learning.actions';

export const learningReducer = createReducer(
  initialLearningState,

  // Load Today Review
  on(LearningActions.loadTodayReview, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(LearningActions.loadTodayReviewSuccess, (state, { terms }) => ({
    ...state,
    todayReview: terms,
    isLoading: false,
    error: null,
  })),

  on(LearningActions.loadTodayReviewFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Submit Review
  on(LearningActions.submitReview, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(LearningActions.submitReviewSuccess, (state, { result }) => ({
    ...state,
    todayReview: state.todayReview.filter((term) => term.termId !== result.termId),
    isLoading: false,
    error: null,
  })),

  on(LearningActions.submitReviewFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Load Learning Stats
  on(LearningActions.loadLearningStats, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(LearningActions.loadLearningStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    isLoading: false,
    error: null,
  })),

  on(LearningActions.loadLearningStatsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
