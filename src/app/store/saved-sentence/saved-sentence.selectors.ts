import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SavedSentenceState } from './saved-sentence.state';

export const selectSavedSentenceState =
  createFeatureSelector<SavedSentenceState>('savedSentence');

export const selectSavedSentences = createSelector(
  selectSavedSentenceState,
  (state) => state.items
);

export const selectIsLoading = createSelector(
  selectSavedSentenceState,
  (state) => state.isLoading
);

export const selectIsSaving = createSelector(
  selectSavedSentenceState,
  (state) => state.isSaving
);

export const selectError = createSelector(selectSavedSentenceState, (state) => state.error);

export const selectSavedSentencesWithPagination = createSelector(
  selectSavedSentenceState,
  (state) => ({
    items: state.items,
    page: state.page,
    totalPages: state.totalPages,
    totalElements: state.totalElements,
  })
);
