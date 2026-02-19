import { createAction, props } from '@ngrx/store';
import {
  StudySet,
  StudySetDetail,
  CreateStudySetRequest,
  UpdateStudySetRequest,
  Term,
  CreateTermRequest,
  UpdateTermRequest,
} from '../../types';

// Load My Study Sets (paginated)
export const loadStudySets = createAction(
  '[StudySet] Load Study Sets',
  props<{ page?: number; size?: number }>()
);

export const loadStudySetsSuccess = createAction(
  '[StudySet] Load Study Sets Success',
  props<{
    studySets: StudySet[];
    totalPages: number;
    totalElements: number;
    page: number;
  }>()
);

export const loadStudySetsFailure = createAction(
  '[StudySet] Load Study Sets Failure',
  props<{ error: string }>()
);

// Load Single Study Set (with terms)
export const loadStudySetById = createAction(
  '[StudySet] Load Study Set By ID',
  props<{ id: string }>()
);

export const loadStudySetByIdSuccess = createAction(
  '[StudySet] Load Study Set By ID Success',
  props<{ studySet: StudySetDetail }>()
);

export const loadStudySetByIdFailure = createAction(
  '[StudySet] Load Study Set By ID Failure',
  props<{ error: string }>()
);

// Create Study Set
export const createStudySet = createAction(
  '[StudySet] Create Study Set',
  props<{ data: CreateStudySetRequest }>()
);

export const createStudySetSuccess = createAction(
  '[StudySet] Create Study Set Success',
  props<{ studySet: StudySetDetail }>()
);

export const createStudySetFailure = createAction(
  '[StudySet] Create Study Set Failure',
  props<{ error: string }>()
);

// Update Study Set
export const updateStudySet = createAction(
  '[StudySet] Update Study Set',
  props<{ id: string; data: UpdateStudySetRequest }>()
);

export const updateStudySetSuccess = createAction(
  '[StudySet] Update Study Set Success',
  props<{ studySet: StudySetDetail }>()
);

export const updateStudySetFailure = createAction(
  '[StudySet] Update Study Set Failure',
  props<{ error: string }>()
);

// Delete Study Set
export const deleteStudySet = createAction(
  '[StudySet] Delete Study Set',
  props<{ id: string }>()
);

export const deleteStudySetSuccess = createAction(
  '[StudySet] Delete Study Set Success',
  props<{ id: string }>()
);

export const deleteStudySetFailure = createAction(
  '[StudySet] Delete Study Set Failure',
  props<{ error: string }>()
);

// Clone Study Set
export const cloneStudySet = createAction(
  '[StudySet] Clone Study Set',
  props<{ id: string }>()
);

export const cloneStudySetSuccess = createAction(
  '[StudySet] Clone Study Set Success',
  props<{ studySet: StudySetDetail }>()
);

export const cloneStudySetFailure = createAction(
  '[StudySet] Clone Study Set Failure',
  props<{ error: string }>()
);

// Term Actions
export const addTerm = createAction(
  '[StudySet] Add Term',
  props<{ studySetId: string; data: CreateTermRequest }>()
);

export const addTermSuccess = createAction(
  '[StudySet] Add Term Success',
  props<{ term: Term }>()
);

export const addTermFailure = createAction(
  '[StudySet] Add Term Failure',
  props<{ error: string }>()
);

export const updateTerm = createAction(
  '[StudySet] Update Term',
  props<{ id: string; data: UpdateTermRequest }>()
);

export const updateTermSuccess = createAction(
  '[StudySet] Update Term Success',
  props<{ term: Term }>()
);

export const updateTermFailure = createAction(
  '[StudySet] Update Term Failure',
  props<{ error: string }>()
);

export const deleteTerm = createAction('[StudySet] Delete Term', props<{ id: string }>());

export const deleteTermSuccess = createAction(
  '[StudySet] Delete Term Success',
  props<{ id: string }>()
);

export const deleteTermFailure = createAction(
  '[StudySet] Delete Term Failure',
  props<{ error: string }>()
);

// Utility
export const clearSelectedStudySet = createAction('[StudySet] Clear Selected Study Set');
