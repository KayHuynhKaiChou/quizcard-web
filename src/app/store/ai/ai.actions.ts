import { createAction, props } from '@ngrx/store';
import {
  AiGenerateRequest,
  AiExtractRequest,
  AiGenerateResponse,
  AiUsageResponse,
  AiTermResponse,
  AiSentence,
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

// Generate Sentences Actions (per term, results cached in store)
export const generateSentences = createAction(
  '[AI] Generate Sentences',
  props<{ termId: string; term: string; count?: number }>()
);

export const generateSentencesSuccess = createAction(
  '[AI] Generate Sentences Success',
  props<{ termId: string; sentences: AiSentence[] }>()
);

export const generateSentencesFailure = createAction(
  '[AI] Generate Sentences Failure',
  props<{ termId: string; error: string }>()
);

// Utility Actions
export const clearGeneratedTerms = createAction('[AI] Clear Generated Terms');

/** Drops the cache for one term so the next open regenerates. */
export const clearSentencesForTerm = createAction(
  '[AI] Clear Sentences For Term',
  props<{ termId: string }>()
);
