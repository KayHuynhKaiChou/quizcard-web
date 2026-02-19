import { StudySet } from '../../types';

export interface ExploreState {
  trending: StudySet[];
  searchResults: StudySet[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  page: number;
  totalPages: number;
  totalElements: number;
}

export const initialExploreState: ExploreState = {
  trending: [],
  searchResults: [],
  categories: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  page: 0,
  totalPages: 0,
  totalElements: 0,
};
