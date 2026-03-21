import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserProfileState } from './user-profile.state';

export const selectUserProfileState = createFeatureSelector<UserProfileState>('userProfile');

export const selectUserProfile = createSelector(
  selectUserProfileState,
  (state) => state.profile
);

export const selectUserStudySets = createSelector(
  selectUserProfileState,
  (state) => state.studySets
);

export const selectIsLoading = createSelector(
  selectUserProfileState,
  (state) => state.isLoading
);

export const selectIsStudySetsLoading = createSelector(
  selectUserProfileState,
  (state) => state.isStudySetsLoading
);

export const selectError = createSelector(
  selectUserProfileState,
  (state) => state.error
);

export const selectStudySetsPage = createSelector(
  selectUserProfileState,
  (state) => state.studySetsPage
);

export const selectStudySetsTotalPages = createSelector(
  selectUserProfileState,
  (state) => state.studySetsTotalPages
);

export const selectStudySetsTotalElements = createSelector(
  selectUserProfileState,
  (state) => state.studySetsTotalElements
);
