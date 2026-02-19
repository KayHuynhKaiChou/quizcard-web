import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LearningState } from './learning.state';

export const selectLearningState = createFeatureSelector<LearningState>('learning');

export const selectTodayReview = createSelector(
  selectLearningState,
  (state) => state.todayReview
);

export const selectLearningStats = createSelector(
  selectLearningState,
  (state) => state.stats
);

export const selectIsLoading = createSelector(
  selectLearningState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectLearningState,
  (state) => state.error
);

export const selectTodayReviewCount = createSelector(
  selectTodayReview,
  (todayReview) => todayReview.length
);
