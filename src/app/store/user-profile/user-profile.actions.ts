import { createAction, props } from '@ngrx/store';
import { StudySet, UserPublicProfile } from '../../types';

export const loadUserProfile = createAction(
  '[UserProfile] Load User Profile',
  props<{ userId: string }>()
);

export const loadUserProfileSuccess = createAction(
  '[UserProfile] Load User Profile Success',
  props<{ profile: UserPublicProfile }>()
);

export const loadUserProfileFailure = createAction(
  '[UserProfile] Load User Profile Failure',
  props<{ error: string }>()
);

export const loadUserStudySets = createAction(
  '[UserProfile] Load User Study Sets',
  props<{ userId: string; page?: number; size?: number }>()
);

export const loadUserStudySetsSuccess = createAction(
  '[UserProfile] Load User Study Sets Success',
  props<{
    studySets: StudySet[];
    totalPages: number;
    totalElements: number;
    page: number;
  }>()
);

export const loadUserStudySetsFailure = createAction(
  '[UserProfile] Load User Study Sets Failure',
  props<{ error: string }>()
);

export const clearUserProfile = createAction('[UserProfile] Clear User Profile');
