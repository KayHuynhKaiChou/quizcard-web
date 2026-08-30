import { SavedSentence } from '../../types';

export interface SavedSentenceState {
  items: SavedSentence[];
  page: number;
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export const initialSavedSentenceState: SavedSentenceState = {
  items: [],
  page: 0,
  totalPages: 0,
  totalElements: 0,
  isLoading: false,
  isSaving: false,
  error: null,
};
