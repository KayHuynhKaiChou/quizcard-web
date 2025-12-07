import { createAction, props } from '@ngrx/store';
import { StudySet } from '../../types';

// Load All Study Sets
export const loadStudySets = createAction('[StudySet] Load Study Sets');

export const loadStudySetsSuccess = createAction(
  '[StudySet] Load Study Sets Success',
  props<{ studySets: StudySet[] }>()
);

export const loadStudySetsFailure = createAction(
  '[StudySet] Load Study Sets Failure',
  props<{ error: string }>()
);

// Load Single Study Set
export const loadStudySetById = createAction(
  '[StudySet] Load Study Set By ID',
  props<{ id: string }>()
);

export const loadStudySetByIdSuccess = createAction(
  '[StudySet] Load Study Set By ID Success',
  props<{ studySet: StudySet }>()
);

export const loadStudySetByIdFailure = createAction(
  '[StudySet] Load Study Set By ID Failure',
  props<{ error: string }>()
);

// Clear Selected Study Set
export const clearSelectedStudySet = createAction('[StudySet] Clear Selected Study Set');
