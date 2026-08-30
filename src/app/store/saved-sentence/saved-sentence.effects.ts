import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import * as SavedSentenceActions from './saved-sentence.actions';
import { environment } from '../../../environments/environment';
import { Page, SavedSentence } from '../../types';

@Injectable()
export class SavedSentenceEffects {
  private readonly API = environment.apiUrl;

  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  loadSavedSentences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSentenceActions.loadSavedSentences),
      switchMap(({ page, size }) => {
        const params = new HttpParams().set('page', page).set('size', size);
        return this.http
          .get<Page<SavedSentence>>(`${this.API}/saved-sentences`, { params })
          .pipe(
            map((response) =>
              SavedSentenceActions.loadSavedSentencesSuccess({ page: response })
            ),
            catchError((error) =>
              of(
                SavedSentenceActions.loadSavedSentencesFailure({
                  error: error.error?.message || 'Không tải được câu đã lưu',
                })
              )
            )
          );
      })
    )
  );

  saveSentences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSentenceActions.saveSentences),
      switchMap(({ sentences }) =>
        this.http
          .post<SavedSentence[]>(`${this.API}/saved-sentences`, { sentences })
          .pipe(
            map((saved) => SavedSentenceActions.saveSentencesSuccess({ saved })),
            catchError((error) =>
              of(
                SavedSentenceActions.saveSentencesFailure({
                  error: error.error?.message || 'Không lưu được câu',
                })
              )
            )
          )
      )
    )
  );

  // mergeMap so rapid deletes of different rows do not cancel each other
  deleteSavedSentence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSentenceActions.deleteSavedSentence),
      mergeMap(({ id }) =>
        this.http.delete<void>(`${this.API}/saved-sentences/${id}`).pipe(
          map(() => SavedSentenceActions.deleteSavedSentenceSuccess({ id })),
          catchError((error) =>
            of(
              SavedSentenceActions.deleteSavedSentenceFailure({
                error: error.error?.message || 'Không xóa được câu',
              })
            )
          )
        )
      )
    )
  );

  saveSentencesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SavedSentenceActions.saveSentencesSuccess),
        tap(({ saved }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Đã lưu',
            detail: `Đã lưu ${saved.length} câu`,
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  deleteSavedSentenceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SavedSentenceActions.deleteSavedSentenceSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Đã xóa',
            detail: 'Đã xóa câu',
            life: 2000,
          });
        })
      ),
    { dispatch: false }
  );

  failures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          SavedSentenceActions.loadSavedSentencesFailure,
          SavedSentenceActions.saveSentencesFailure,
          SavedSentenceActions.deleteSavedSentenceFailure
        ),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error,
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );
}
