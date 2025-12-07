import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StudySetState } from './studyset.state';

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

export const selectError = createSelector(
  selectStudySetState,
  (state) => state.error
);

export const selectPublicStudySets = createSelector(
  selectAllStudySets,
  (studySets) => studySets.filter(set => set.mode === 'public')
);
