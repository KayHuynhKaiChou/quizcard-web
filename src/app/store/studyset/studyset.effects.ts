import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as StudySetActions from './studyset.actions';
import { StudySetService } from '../../services/studyset.service';
import { LoadingService } from '../../services/loading.service';

@Injectable()
export class StudySetEffects {
  private actions$ = inject(Actions);
  private studySetService = inject(StudySetService);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  loadStudySets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.loadStudySets),
      tap(() => this.loadingService.show('Đang tải danh sách bộ thẻ...')),
      switchMap(({ page, size }) =>
        this.studySetService.getMyStudySets(page, size).pipe(
          map((response) =>
            StudySetActions.loadStudySetsSuccess({
              studySets: response.content,
              totalPages: response.totalPages,
              totalElements: response.totalElements,
              page: response.number,
            })
          ),
          catchError((error) =>
            of(StudySetActions.loadStudySetsFailure({ error: error.error?.message || 'Tải danh sách thất bại' }))
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  loadStudySetById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.loadStudySetById),
      tap(() => this.loadingService.show('Đang tải bộ thẻ...')),
      switchMap(({ id }) =>
        this.studySetService.getStudySetById(id).pipe(
          map((studySet) => StudySetActions.loadStudySetByIdSuccess({ studySet })),
          catchError((error) =>
            of(
              StudySetActions.loadStudySetByIdFailure({
                error: error.error?.message || 'Không tìm thấy bộ thẻ',
              })
            )
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  // Auto-load terms after study set metadata is loaded
  autoLoadTerms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.loadStudySetByIdSuccess),
      map(({ studySet }) => StudySetActions.loadStudySetTerms({ id: studySet.id }))
    )
  );

  loadStudySetTerms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.loadStudySetTerms),
      switchMap(({ id, cursor, limit }) =>
        this.studySetService.getTerms(id, cursor, limit).pipe(
          map((termsPage) => StudySetActions.loadStudySetTermsSuccess({ termsPage })),
          catchError((error) =>
            of(
              StudySetActions.loadStudySetTermsFailure({
                error: error.error?.message || 'Tải thuật ngữ thất bại',
              })
            )
          )
        )
      )
    )
  );

  createStudySet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.createStudySet),
      tap(() => this.loadingService.show('Đang tạo bộ thẻ...')),
      switchMap(({ data }) =>
        this.studySetService.createStudySet(data).pipe(
          map((studySet) => StudySetActions.createStudySetSuccess({ studySet })),
          catchError((error) =>
            of(StudySetActions.createStudySetFailure({ error: error.error?.message || 'Tạo bộ thẻ thất bại' }))
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  createStudySetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StudySetActions.createStudySetSuccess),
        tap(({ studySet }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Tạo thành công',
            detail: `Bộ thẻ "${studySet.title}" đã được tạo.`,
            life: 3000,
          });
          this.router.navigate(['/set', studySet.id]);
        })
      ),
    { dispatch: false }
  );

  updateStudySet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.updateStudySet),
      tap(() => this.loadingService.show('Đang cập nhật...')),
      switchMap(({ id, data }) =>
        this.studySetService.updateStudySet(id, data).pipe(
          map((studySet) => StudySetActions.updateStudySetSuccess({ studySet })),
          catchError((error) =>
            of(StudySetActions.updateStudySetFailure({ error: error.error?.message || 'Cập nhật thất bại' }))
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  updateStudySetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StudySetActions.updateStudySetSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật thành công',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  deleteStudySet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.deleteStudySet),
      tap(() => this.loadingService.show('Đang xóa...')),
      switchMap(({ id }) =>
        this.studySetService.deleteStudySet(id).pipe(
          map(() => StudySetActions.deleteStudySetSuccess({ id })),
          catchError((error) =>
            of(StudySetActions.deleteStudySetFailure({ error: error.error?.message || 'Xóa thất bại' }))
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  deleteStudySetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StudySetActions.deleteStudySetSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Đã xóa bộ thẻ',
            life: 3000,
          });
          this.router.navigate(['/library']);
        })
      ),
    { dispatch: false }
  );

  cloneStudySet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.cloneStudySet),
      tap(() => this.loadingService.show('Đang sao chép...')),
      switchMap(({ id }) =>
        this.studySetService.cloneStudySet(id).pipe(
          map((studySet) => StudySetActions.cloneStudySetSuccess({ studySet })),
          catchError((error) =>
            of(StudySetActions.cloneStudySetFailure({ error: error.error?.message || 'Sao chép thất bại' }))
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  cloneStudySetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StudySetActions.cloneStudySetSuccess),
        tap(({ studySet }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Đã clone bộ thẻ thành công',
            life: 3000,
          });
          this.router.navigate(['/set', studySet.id]);
        })
      ),
    { dispatch: false }
  );

  // Term Effects
  addTerm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.addTerm),
      switchMap(({ studySetId, data }) =>
        this.studySetService.addTerm(studySetId, data).pipe(
          map((term) => StudySetActions.addTermSuccess({ term })),
          catchError((error) =>
            of(StudySetActions.addTermFailure({ error: error.error?.message || 'Thêm thuật ngữ thất bại' }))
          )
        )
      )
    )
  );

  updateTerm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.updateTerm),
      switchMap(({ id, data }) =>
        this.studySetService.updateTerm(id, data).pipe(
          map((term) => StudySetActions.updateTermSuccess({ term })),
          catchError((error) =>
            of(StudySetActions.updateTermFailure({ error: error.error?.message || 'Cập nhật thuật ngữ thất bại' }))
          )
        )
      )
    )
  );

  deleteTerm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.deleteTerm),
      switchMap(({ id }) =>
        this.studySetService.deleteTerm(id).pipe(
          map(() => StudySetActions.deleteTermSuccess({ id })),
          catchError((error) =>
            of(StudySetActions.deleteTermFailure({ error: error.error?.message || 'Xóa thuật ngữ thất bại' }))
          )
        )
      )
    )
  );
}
