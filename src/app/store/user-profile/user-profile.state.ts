import { StudySet, UserPublicProfile } from '../../types';

export interface UserProfileState {
  profile: UserPublicProfile | null;
  studySets: StudySet[];
  isLoading: boolean;
  isStudySetsLoading: boolean;
  error: string | null;
  studySetsPage: number;
  studySetsTotalPages: number;
  studySetsTotalElements: number;
}

export const initialUserProfileState: UserProfileState = {
  profile: null,
  studySets: [],
  isLoading: false,
  isStudySetsLoading: false,
  error: null,
  studySetsPage: 0,
  studySetsTotalPages: 0,
  studySetsTotalElements: 0,
};
