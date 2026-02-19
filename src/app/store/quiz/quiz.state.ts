import { QuizResult } from '../../types';

export interface QuizState {
  currentQuiz: any | null; // Generated quiz data from backend
  history: QuizResult[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
}

export const initialQuizState: QuizState = {
  currentQuiz: null,
  history: [],
  isLoading: false,
  error: null,
  page: 0,
  totalPages: 0,
  totalElements: 0,
};
