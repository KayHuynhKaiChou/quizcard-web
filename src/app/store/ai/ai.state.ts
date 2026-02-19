import { AiUsageResponse, AiTermResponse } from '../../types';

export interface AiState {
  usage: AiUsageResponse | null;
  generatedTerms: AiTermResponse[];
  isLoading: boolean;
  error: string | null;
}

export const initialAiState: AiState = {
  usage: null,
  generatedTerms: [],
  isLoading: false,
  error: null,
};
