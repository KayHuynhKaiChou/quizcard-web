import { createReducer, on } from '@ngrx/store';
import { StudySetState, initialStudySetState } from './studyset.state';
import * as StudySetActions from './studyset.actions';

export const studySetReducer = createReducer(
  initialStudySetState,

  // Load All Study Sets
  on(StudySetActions.loadStudySets, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(StudySetActions.loadStudySetsSuccess, (state, { studySets }) => ({
    ...state,
    studySets,
    isLoading: false,
    error: null
  })),

  on(StudySetActions.loadStudySetsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load Single Study Set
  on(StudySetActions.loadStudySetById, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(StudySetActions.loadStudySetByIdSuccess, (state, { studySet }) => ({
    ...state,
    selectedStudySet: studySet,
    isLoading: false,
    error: null
  })),

  on(StudySetActions.loadStudySetByIdFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Clear Selected Study Set
  on(StudySetActions.clearSelectedStudySet, (state) => ({
    ...state,
    selectedStudySet: null
  }))
);
