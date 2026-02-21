import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ExploreActions from './explore.actions';
import { Page, StudySet } from '../../types';
import { environment } from '../../../environments/environment';

@Injectable()
export class ExploreEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadTrending$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExploreActions.loadTrending),
      switchMap(({ page = 0, size = 20, category }) => {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        if (category) {
          params = params.set('category', category);
        }

        return this.http
          .get<Page<StudySet>>(`${environment.apiUrl}/explore/trending`, { params })
          .pipe(
            map((response) =>
              ExploreActions.loadTrendingSuccess({
                studySets: response.content,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                page: response.number,
              })
            ),
            catchError((error) =>
              of(
                ExploreActions.loadTrendingFailure({
                  error: error.error?.message || 'Failed to load trending study sets',
                })
              )
            )
          );
      })
    )
  );

  loadRecent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExploreActions.loadRecent),
      switchMap(({ page = 0, size = 20 }) => {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        return this.http
          .get<Page<StudySet>>(`${environment.apiUrl}/explore/recent`, { params })
          .pipe(
            map((response) =>
              ExploreActions.loadRecentSuccess({
                studySets: response.content,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                page: response.number,
              })
            ),
            catchError((error) =>
              of(
                ExploreActions.loadRecentFailure({
                  error: error.error?.message || 'Failed to load recent study sets',
                })
              )
            )
          );
      })
    )
  );

  searchStudySets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExploreActions.searchStudySets),
      switchMap(({ query, page = 0, size = 20 }) => {
        const params = new HttpParams()
          .set('q', query)
          .set('page', page.toString())
          .set('size', size.toString());

        return this.http
          .get<Page<StudySet>>(`${environment.apiUrl}/explore/search`, { params })
          .pipe(
            map((response) =>
              ExploreActions.searchStudySetsSuccess({
                studySets: response.content,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                page: response.number,
                query,
              })
            ),
            catchError((error) =>
              of(
                ExploreActions.searchStudySetsFailure({
                  error: error.error?.message || 'Search failed',
                })
              )
            )
          );
      })
    )
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExploreActions.loadCategories),
      switchMap(() =>
        this.http.get<string[]>(`${environment.apiUrl}/explore/categories`).pipe(
          map((categories) => ExploreActions.loadCategoriesSuccess({ categories })),
          catchError((error) =>
            of(
              ExploreActions.loadCategoriesFailure({
                error: error.error?.message || 'Failed to load categories',
              })
            )
          )
        )
      )
    )
  );
}
