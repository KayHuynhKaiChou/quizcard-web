import { createReducer, on } from '@ngrx/store';
import { StudySetState, initialStudySetState } from './studyset.state';
import * as StudySetActions from './studyset.actions';

export const studySetReducer = createReducer(
  initialStudySetState,

  // Load Study Sets
  on(StudySetActions.loadStudySets, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    StudySetActions.loadStudySetsSuccess,
    (state, { studySets, totalPages, totalElements, page }) => ({
      ...state,
      studySets,
      totalPages,
      totalElements,
      page,
      isLoading: false,
      error: null,
    })
  ),

  on(StudySetActions.loadStudySetsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Load Single Study Set
  on(StudySetActions.loadStudySetById, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(StudySetActions.loadStudySetByIdSuccess, (state, { studySet }) => ({
    ...state,
    selectedStudySet: studySet,
    isLoading: false,
    error: null,
  })),

  on(StudySetActions.loadStudySetByIdFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Create Study Set
  on(StudySetActions.createStudySet, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(StudySetActions.createStudySetSuccess, (state, { studySet }) => ({
    ...state,
    studySets: [studySet, ...state.studySets],
    isLoading: false,
    error: null,
  })),

  on(StudySetActions.createStudySetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Update Study Set
  on(StudySetActions.updateStudySet, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(StudySetActions.updateStudySetSuccess, (state, { studySet }) => ({
    ...state,
    studySets: state.studySets.map((s) => (s.id === studySet.id ? studySet : s)),
    selectedStudySet:
      state.selectedStudySet?.id === studySet.id ? studySet : state.selectedStudySet,
    isLoading: false,
    error: null,
  })),

  on(StudySetActions.updateStudySetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Delete Study Set
  on(StudySetActions.deleteStudySet, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(StudySetActions.deleteStudySetSuccess, (state, { id }) => ({
    ...state,
    studySets: state.studySets.filter((s) => s.id !== id),
    selectedStudySet: state.selectedStudySet?.id === id ? null : state.selectedStudySet,
    isLoading: false,
    error: null,
  })),

  on(StudySetActions.deleteStudySetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Clone Study Set
  on(StudySetActions.cloneStudySet, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(StudySetActions.cloneStudySetSuccess, (state, { studySet }) => ({
    ...state,
    studySets: [studySet, ...state.studySets],
    isLoading: false,
    error: null,
  })),

  on(StudySetActions.cloneStudySetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Add Term
  on(StudySetActions.addTermSuccess, (state, { term }) => ({
    ...state,
    selectedStudySet: state.selectedStudySet
      ? {
          ...state.selectedStudySet,
          terms: [...state.selectedStudySet.terms, term],
          termsCount: state.selectedStudySet.termsCount + 1,
        }
      : null,
  })),

  // Update Term
  on(StudySetActions.updateTermSuccess, (state, { term }) => ({
    ...state,
    selectedStudySet: state.selectedStudySet
      ? {
          ...state.selectedStudySet,
          terms: state.selectedStudySet.terms.map((t) => (t.id === term.id ? term : t)),
        }
      : null,
  })),

  // Delete Term
  on(StudySetActions.deleteTermSuccess, (state, { id }) => ({
    ...state,
    selectedStudySet: state.selectedStudySet
      ? {
          ...state.selectedStudySet,
          terms: state.selectedStudySet.terms.filter((t) => t.id !== id),
          termsCount: state.selectedStudySet.termsCount - 1,
        }
      : null,
  })),

  // Clear Selected
  on(StudySetActions.clearSelectedStudySet, (state) => ({
    ...state,
    selectedStudySet: null,
  }))
);
