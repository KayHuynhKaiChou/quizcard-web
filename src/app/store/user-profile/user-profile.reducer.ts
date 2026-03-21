import { createReducer, on } from '@ngrx/store';
import { UserProfileState, initialUserProfileState } from './user-profile.state';
import * as UserProfileActions from './user-profile.actions';

export const userProfileReducer = createReducer(
  initialUserProfileState,

  on(UserProfileActions.loadUserProfile, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UserProfileActions.loadUserProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    isLoading: false,
    error: null,
  })),

  on(UserProfileActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(UserProfileActions.loadUserStudySets, (state) => ({
    ...state,
    isStudySetsLoading: true,
    error: null,
  })),

  on(UserProfileActions.loadUserStudySetsSuccess, (state, { studySets, totalPages, totalElements, page }) => ({
    ...state,
    studySets: page === 0 ? studySets : [...state.studySets, ...studySets],
    studySetsPage: page,
    studySetsTotalPages: totalPages,
    studySetsTotalElements: totalElements,
    isStudySetsLoading: false,
    error: null,
  })),

  on(UserProfileActions.loadUserStudySetsFailure, (state, { error }) => ({
    ...state,
    isStudySetsLoading: false,
    error,
  })),

  on(UserProfileActions.clearUserProfile, () => ({ ...initialUserProfileState }))
);
