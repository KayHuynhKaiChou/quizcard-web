import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription, take } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { StudySetFormPage } from '../../components/common/study-set-form-page/study-set-form-page';
import { StudySetForm, StudySetFormData } from '../../components/common/study-set-form/study-set-form';
import { StudySetDetail, UpdateStudySetRequest } from '../../types';

@Component({
  selector: 'app-edit-studyset',
  standalone: true,
  imports: [CommonModule, StudySetFormPage, StudySetForm],
  templateUrl: './edit-studyset.html',
  styleUrl: './edit-studyset.scss',
})
export class EditStudySetPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private actions$ = inject(Actions);
  private sub = new Subscription();

  studySet: StudySetDetail | null = null;
  isLoading = signal(true);
  isSubmitting = signal(false);

  studySetId: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.studySetId = id;
    if (id) {
      this.store.dispatch(StudySetActions.loadStudySetById({ id }));
    }

    // Keep studySet up-to-date as store emits (metadata first, then with terms)
    this.sub.add(
      this.store.select(StudySetSelectors.selectSelectedStudySet).subscribe((ss) => {
        if (ss) {
          this.studySet = ss;
          this.store.select(AuthSelectors.selectUser).pipe(take(1)).subscribe(user => {
            if (user && ss.userId !== user.id) {
              this.router.navigate(['/set', ss.id]);
            }
          });
        }
      })
    );

    // Show form only after terms are loaded so TermEditor initializes with real data
    this.sub.add(
      this.actions$.pipe(
        ofType(StudySetActions.loadStudySetTermsSuccess, StudySetActions.loadStudySetTermsFailure)
      ).subscribe(() => this.isLoading.set(false))
    );

    this.sub.add(
      this.actions$
        .pipe(ofType(StudySetActions.updateStudySetSuccess, StudySetActions.updateStudySetFailure))
        .subscribe(() => this.isSubmitting.set(false))
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onFormSubmit(data: StudySetFormData): void {
    if (!this.studySet) return;
    this.isSubmitting.set(true);
    const request: UpdateStudySetRequest = {
      title: data.title,
      description: data.description || undefined,
      visibility: data.visibility,
    };
    this.store.dispatch(StudySetActions.updateStudySet({ id: this.studySet.id, data: request }));
  }
}
