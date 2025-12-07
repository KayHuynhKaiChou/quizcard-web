import { StudySet } from '../../types';

export interface StudySetState {
  studySets: StudySet[];
  selectedStudySet: StudySet | null;
  isLoading: boolean;
  error: string | null;
}

export const initialStudySetState: StudySetState = {
  studySets: [],
  selectedStudySet: null,
  isLoading: false,
  error: null
};
