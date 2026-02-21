import { createAction, props } from '@ngrx/store';
import { StudySet } from '../../types';

// Load Trending
export const loadTrending = createAction(
  '[Explore] Load Trending',
  props<{ page?: number; size?: number; category?: string }>()
);

export const loadTrendingSuccess = createAction(
  '[Explore] Load Trending Success',
  props<{
    studySets: StudySet[];
    totalPages: number;
    totalElements: number;
    page: number;
  }>()
);

export const loadTrendingFailure = createAction(
  '[Explore] Load Trending Failure',
  props<{ error: string }>()
);

// Load Recent
export const loadRecent = createAction(
  '[Explore] Load Recent',
  props<{ page?: number; size?: number }>()
);

export const loadRecentSuccess = createAction(
  '[Explore] Load Recent Success',
  props<{
    studySets: StudySet[];
    totalPages: number;
    totalElements: number;
    page: number;
  }>()
);

export const loadRecentFailure = createAction(
  '[Explore] Load Recent Failure',
  props<{ error: string }>()
);

// Search Study Sets
export const searchStudySets = createAction(
  '[Explore] Search Study Sets',
  props<{ query: string; page?: number; size?: number }>()
);

export const searchStudySetsSuccess = createAction(
  '[Explore] Search Study Sets Success',
  props<{
    studySets: StudySet[];
    totalPages: number;
    totalElements: number;
    page: number;
    query: string;
  }>()
);

export const searchStudySetsFailure = createAction(
  '[Explore] Search Study Sets Failure',
  props<{ error: string }>()
);

// Load Categories
export const loadCategories = createAction('[Explore] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Explore] Load Categories Success',
  props<{ categories: string[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Explore] Load Categories Failure',
  props<{ error: string }>()
);
