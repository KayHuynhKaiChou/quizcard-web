import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExploreState } from './explore.state';

export const selectExploreState = createFeatureSelector<ExploreState>('explore');

export const selectTrending = createSelector(
  selectExploreState,
  (state) => state.trending
);

export const selectSearchResults = createSelector(
  selectExploreState,
  (state) => state.searchResults
);

export const selectCategories = createSelector(
  selectExploreState,
  (state) => state.categories
);

export const selectIsLoading = createSelector(
  selectExploreState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectExploreState,
  (state) => state.error
);

export const selectSearchQuery = createSelector(
  selectExploreState,
  (state) => state.searchQuery
);
