import { createReducer, on } from '@ngrx/store';
import { AiState, initialAiState } from './ai.state';
import * as AiActions from './ai.actions';

export const aiReducer = createReducer(
  initialAiState,

  // Get AI Usage
  on(AiActions.getAiUsage, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AiActions.getAiUsageSuccess, (state, { usage }) => ({
    ...state,
    usage,
    isLoading: false,
    error: null,
  })),

  on(AiActions.getAiUsageFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Generate Terms
  on(AiActions.generateTerms, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AiActions.generateTermsSuccess, (state, { terms, remainingUsage }) => ({
    ...state,
    generatedTerms: terms,
    usage: state.usage ? { ...state.usage, remaining: remainingUsage } : null,
    isLoading: false,
    error: null,
  })),

  on(AiActions.generateTermsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Extract From Text
  on(AiActions.extractFromText, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AiActions.extractFromTextSuccess, (state, { terms, remainingUsage }) => ({
    ...state,
    generatedTerms: terms,
    usage: state.usage ? { ...state.usage, remaining: remainingUsage } : null,
    isLoading: false,
    error: null,
  })),

  on(AiActions.extractFromTextFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Clear Generated Terms
  on(AiActions.clearGeneratedTerms, (state) => ({
    ...state,
    generatedTerms: [],
  }))
);
