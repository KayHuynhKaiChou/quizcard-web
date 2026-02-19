import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AiState } from './ai.state';

export const selectAiState = createFeatureSelector<AiState>('ai');

export const selectAiUsage = createSelector(selectAiState, (state) => state.usage);

export const selectGeneratedTerms = createSelector(
  selectAiState,
  (state) => state.generatedTerms
);

export const selectIsLoading = createSelector(selectAiState, (state) => state.isLoading);

export const selectError = createSelector(selectAiState, (state) => state.error);

export const selectRemainingUsage = createSelector(
  selectAiUsage,
  (usage) => usage?.remaining ?? null
);
