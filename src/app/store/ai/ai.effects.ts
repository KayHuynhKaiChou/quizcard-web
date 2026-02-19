import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import * as AiActions from './ai.actions';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { AiGenerateResponse, AiUsageResponse } from '../../types';

@Injectable()
export class AiEffects {
  private readonly API = environment.apiUrl;

  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);

  // Get AI Usage Effect
  getAiUsage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiActions.getAiUsage),
      switchMap(() =>
        this.http.get<AiUsageResponse>(`${this.API}/ai/usage`).pipe(
          map((usage) => AiActions.getAiUsageSuccess({ usage })),
          catchError((error) =>
            of(
              AiActions.getAiUsageFailure({
                error: error.error?.message || 'Failed to fetch AI usage',
              })
            )
          )
        )
      )
    )
  );

  // Generate Terms Effect
  generateTerms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiActions.generateTerms),
      tap(() => this.loadingService.show('Generating terms...')),
      switchMap((action) => {
        const { type, ...body } = action;
        return this.http
          .post<AiGenerateResponse>(`${this.API}/ai/generate-terms`, body)
          .pipe(
            map((response) =>
              AiActions.generateTermsSuccess({
                remainingUsage: response.remainingUsage,
                terms: response.terms,
              })
            ),
            catchError((error) =>
              of(
                AiActions.generateTermsFailure({
                  error: error.error?.message || 'Failed to generate terms',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          );
      })
    )
  );

  // Extract From Text Effect
  extractFromText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiActions.extractFromText),
      tap(() => this.loadingService.show('Extracting terms from text...')),
      switchMap((action) => {
        const { type, ...body } = action;
        return this.http
          .post<AiGenerateResponse>(`${this.API}/ai/extract-from-text`, body)
          .pipe(
            map((response) =>
              AiActions.extractFromTextSuccess({
                remainingUsage: response.remainingUsage,
                terms: response.terms,
              })
            ),
            catchError((error) =>
              of(
                AiActions.extractFromTextFailure({
                  error: error.error?.message || 'Failed to extract terms from text',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          );
      })
    )
  );

  // Success notification for generate terms
  generateTermsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AiActions.generateTermsSuccess),
        tap(({ terms }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Terms Generated',
            detail: `Successfully generated ${terms.length} terms`,
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  // Success notification for extract from text
  extractFromTextSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AiActions.extractFromTextSuccess),
        tap(({ terms }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Terms Extracted',
            detail: `Successfully extracted ${terms.length} terms`,
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  // Failure notifications
  generateTermsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AiActions.generateTermsFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Generation Failed',
            detail: error || 'Failed to generate terms',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  extractFromTextFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AiActions.extractFromTextFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Extraction Failed',
            detail: error || 'Failed to extract terms from text',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );
}
