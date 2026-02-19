import { createReducer, on } from '@ngrx/store';
import { ExploreState, initialExploreState } from './explore.state';
import * as ExploreActions from './explore.actions';

export const exploreReducer = createReducer(
  initialExploreState,

  // Load Trending
  on(ExploreActions.loadTrending, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(ExploreActions.loadTrendingSuccess, (state, { studySets, totalPages, totalElements, page }) => ({
    ...state,
    trending: studySets,
    totalPages,
    totalElements,
    page,
    isLoading: false,
    error: null,
  })),

  on(ExploreActions.loadTrendingFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Search Study Sets
  on(ExploreActions.searchStudySets, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    ExploreActions.searchStudySetsSuccess,
    (state, { studySets, totalPages, totalElements, page, query }) => ({
      ...state,
      searchResults: studySets,
      totalPages,
      totalElements,
      page,
      searchQuery: query,
      isLoading: false,
      error: null,
    })
  ),

  on(ExploreActions.searchStudySetsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Load Categories
  on(ExploreActions.loadCategories, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(ExploreActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    isLoading: false,
    error: null,
  })),

  on(ExploreActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
