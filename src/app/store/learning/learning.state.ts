import { LearningStats, ReviewTerm } from '../../types';

export interface LearningState {
  todayReview: ReviewTerm[];
  stats: LearningStats | null;
  isLoading: boolean;
  error: string | null;
}

export const initialLearningState: LearningState = {
  todayReview: [],
  stats: null,
  isLoading: false,
  error: null,
};
