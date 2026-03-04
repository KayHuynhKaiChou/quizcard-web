import { StudySet, StudySetDetail } from '../../types';

export interface StudySetState {
  studySets: StudySet[];
  selectedStudySet: StudySetDetail | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  termsCursor: number | null;
  hasMoreTerms: boolean;
  isLoadingTerms: boolean;
}

export const initialStudySetState: StudySetState = {
  studySets: [],
  selectedStudySet: null,
  isLoading: false,
  error: null,
  page: 0,
  totalPages: 0,
  totalElements: 0,
  termsCursor: null,
  hasMoreTerms: false,
  isLoadingTerms: false,
};
