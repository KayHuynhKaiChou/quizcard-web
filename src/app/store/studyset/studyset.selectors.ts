import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StudySetState } from './studyset.state';
import { Visibility } from '../../types/enum';

export const selectStudySetState = createFeatureSelector<StudySetState>('studySet');

export const selectAllStudySets = createSelector(
  selectStudySetState,
  (state) => state.studySets
);

export const selectSelectedStudySet = createSelector(
  selectStudySetState,
  (state) => state.selectedStudySet
);

export const selectIsLoading = createSelector(
  selectStudySetState,
  (state) => state.isLoading
);

export const selectError = createSelector(selectStudySetState, (state) => state.error);

export const selectPage = createSelector(selectStudySetState, (state) => state.page);

export const selectTotalPages = createSelector(
  selectStudySetState,
  (state) => state.totalPages
);

export const selectTotalElements = createSelector(
  selectStudySetState,
  (state) => state.totalElements
);

export const selectPublicStudySets = createSelector(selectAllStudySets, (studySets) =>
  studySets.filter((set) => set.visibility === Visibility.PUBLIC)
);

export const selectSelectedTerms = createSelector(
  selectSelectedStudySet,
  (studySet) => studySet?.terms ?? []
);
