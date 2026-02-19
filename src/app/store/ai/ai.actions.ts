import { createAction, props } from '@ngrx/store';
import {
  AiGenerateRequest,
  AiExtractRequest,
  AiGenerateResponse,
  AiUsageResponse,
  AiTermResponse,
} from '../../types';

// Get AI Usage Actions
export const getAiUsage = createAction('[AI] Get AI Usage');

export const getAiUsageSuccess = createAction(
  '[AI] Get AI Usage Success',
  props<{ usage: AiUsageResponse }>()
);

export const getAiUsageFailure = createAction(
  '[AI] Get AI Usage Failure',
  props<{ error: string }>()
);

// Generate Terms Actions
export const generateTerms = createAction('[AI] Generate Terms', props<AiGenerateRequest>());

export const generateTermsSuccess = createAction(
  '[AI] Generate Terms Success',
  props<AiGenerateResponse>()
);

export const generateTermsFailure = createAction(
  '[AI] Generate Terms Failure',
  props<{ error: string }>()
);

// Extract From Text Actions
export const extractFromText = createAction('[AI] Extract From Text', props<AiExtractRequest>());

export const extractFromTextSuccess = createAction(
  '[AI] Extract From Text Success',
  props<AiGenerateResponse>()
);

export const extractFromTextFailure = createAction(
  '[AI] Extract From Text Failure',
  props<{ error: string }>()
);

// Utility Actions
export const clearGeneratedTerms = createAction('[AI] Clear Generated Terms');
