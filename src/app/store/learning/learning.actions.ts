import { createAction, props } from '@ngrx/store';
import { LearningStats, ReviewRequest, ReviewTerm } from '../../types';

// Load Today's Review
export const loadTodayReview = createAction('[Learning] Load Today Review');

export const loadTodayReviewSuccess = createAction(
  '[Learning] Load Today Review Success',
  props<{ terms: ReviewTerm[] }>()
);

export const loadTodayReviewFailure = createAction(
  '[Learning] Load Today Review Failure',
  props<{ error: string }>()
);

// Submit Review
export const submitReview = createAction(
  '[Learning] Submit Review',
  props<ReviewRequest>()
);

export const submitReviewSuccess = createAction(
  '[Learning] Submit Review Success',
  props<{ result: any }>()
);

export const submitReviewFailure = createAction(
  '[Learning] Submit Review Failure',
  props<{ error: string }>()
);

// Load Learning Stats
export const loadLearningStats = createAction('[Learning] Load Learning Stats');

export const loadLearningStatsSuccess = createAction(
  '[Learning] Load Learning Stats Success',
  props<{ stats: LearningStats }>()
);

export const loadLearningStatsFailure = createAction(
  '[Learning] Load Learning Stats Failure',
  props<{ error: string }>()
);
