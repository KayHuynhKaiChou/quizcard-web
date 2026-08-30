import { AiSentence, AiUsageResponse, AiTermResponse } from '../../types';

export interface AiState {
  usage: AiUsageResponse | null;
  generatedTerms: AiTermResponse[];
  /** Example sentences cached per term id, so reopening the modal is free. */
  generatedSentences: Record<string, AiSentence[]>;
  /** Term id currently being generated for, null when idle. */
  sentencesLoadingTermId: string | null;
  sentencesError: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAiState: AiState = {
  usage: null,
  generatedTerms: [],
  generatedSentences: {},
  sentencesLoadingTermId: null,
  sentencesError: null,
  isLoading: false,
  error: null,
};
