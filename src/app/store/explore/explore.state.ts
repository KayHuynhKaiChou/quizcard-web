import { StudySet } from '../../types';

export interface ExploreState {
  trending: StudySet[];
  recent: StudySet[];
  searchResults: StudySet[];
  categories: string[];
  isLoading: boolean;
  isTrendingLoading: boolean;
  isRecentLoading: boolean;
  error: string | null;
  searchQuery: string;
  page: number;
  totalPages: number;
  totalElements: number;
}

export const initialExploreState: ExploreState = {
  trending: [],
  recent: [],
  searchResults: [],
  categories: [],
  isLoading: false,
  isTrendingLoading: false,
  isRecentLoading: false,
  error: null,
  searchQuery: '',
  page: 0,
  totalPages: 0,
  totalElements: 0,
};
