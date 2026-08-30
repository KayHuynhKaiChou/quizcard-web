import { createReducer, on } from '@ngrx/store';
import { SavedSentenceState, initialSavedSentenceState } from './saved-sentence.state';
import * as SavedSentenceActions from './saved-sentence.actions';

export const savedSentenceReducer = createReducer(
  initialSavedSentenceState,

  // Load
  on(SavedSentenceActions.loadSavedSentences, (state): SavedSentenceState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(SavedSentenceActions.loadSavedSentencesSuccess, (state, { page }): SavedSentenceState => ({
    ...state,
    items: page.content,
    page: page.number,
    totalPages: page.totalPages,
    totalElements: page.totalElements,
    isLoading: false,
    error: null,
  })),

  on(SavedSentenceActions.loadSavedSentencesFailure, (state, { error }): SavedSentenceState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Save
  on(SavedSentenceActions.saveSentences, (state): SavedSentenceState => ({
    ...state,
    isSaving: true,
    error: null,
  })),

  on(SavedSentenceActions.saveSentencesSuccess, (state, { saved }): SavedSentenceState => ({
    ...state,
    // The list page reloads on its own; only the counter needs to stay in sync
    // for callers that keep the store alive across navigation.
    totalElements: state.totalElements + saved.length,
    isSaving: false,
    error: null,
  })),

  on(SavedSentenceActions.saveSentencesFailure, (state, { error }): SavedSentenceState => ({
    ...state,
    isSaving: false,
    error,
  })),

  // Delete — drop locally instead of refetching the whole page
  on(SavedSentenceActions.deleteSavedSentenceSuccess, (state, { id }): SavedSentenceState => ({
    ...state,
    items: state.items.filter((s) => s.id !== id),
    totalElements: Math.max(0, state.totalElements - 1),
  })),

  on(SavedSentenceActions.deleteSavedSentenceFailure, (state, { error }): SavedSentenceState => ({
    ...state,
    error,
  }))
);
