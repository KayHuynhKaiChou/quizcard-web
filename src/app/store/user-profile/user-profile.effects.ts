import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserProfileActions from './user-profile.actions';
import { Page, StudySet, UserPublicProfile } from '../../types';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';

@Injectable()
export class UserProfileEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfileActions.loadUserProfile),
      tap(() => this.loadingService.show()),
      switchMap(({ userId }) =>
        this.http.get<UserPublicProfile>(`${environment.apiUrl}/users/${userId}/profile`).pipe(
          map((profile) => UserProfileActions.loadUserProfileSuccess({ profile })),
          catchError((error) =>
            of(
              UserProfileActions.loadUserProfileFailure({
                error: error.error?.message || 'Không thể tải thông tin người dùng',
              })
            )
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  loadUserStudySets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfileActions.loadUserStudySets),
      switchMap(({ userId, page = 0, size = 20 }) => {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        return this.http
          .get<Page<StudySet>>(`${environment.apiUrl}/users/${userId}/study-sets`, { params })
          .pipe(
            map((response) =>
              UserProfileActions.loadUserStudySetsSuccess({
                studySets: response.content,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                page: response.number,
              })
            ),
            catchError((error) =>
              of(
                UserProfileActions.loadUserStudySetsFailure({
                  error: error.error?.message || 'Không thể tải bộ học',
                })
              )
            )
          );
      })
    )
  );
}
