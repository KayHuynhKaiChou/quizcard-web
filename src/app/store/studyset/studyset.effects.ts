import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as StudySetActions from './studyset.actions';
import { StudySetService } from '../../services/studyset.service';

@Injectable()
export class StudySetEffects {
  private actions$ = inject(Actions);
  private studySetService = inject(StudySetService);

  loadStudySets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.loadStudySets),
      switchMap(() =>
        this.studySetService.getAllStudySets().pipe(
          map((studySets) => StudySetActions.loadStudySetsSuccess({ studySets })),
          catchError((error) =>
            of(StudySetActions.loadStudySetsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadStudySetById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudySetActions.loadStudySetById),
      switchMap(({ id }) =>
        this.studySetService.getStudySetById(id).pipe(
          map((studySet) => {
            if (studySet) {
              return StudySetActions.loadStudySetByIdSuccess({ studySet });
            } else {
              return StudySetActions.loadStudySetByIdFailure({
                error: 'Study set not found'
              });
            }
          }),
          catchError((error) =>
            of(StudySetActions.loadStudySetByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
