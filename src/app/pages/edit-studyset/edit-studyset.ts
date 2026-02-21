import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
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
  private sub = new Subscription();

  studySet: StudySetDetail | null = null;
  isLoading = signal(true);
  isSubmitting = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(StudySetActions.loadStudySetById({ id }));
    }

    this.sub.add(
      this.store.select(StudySetSelectors.selectSelectedStudySet).subscribe((ss) => {
        if (ss) {
          this.studySet = ss;
          this.isLoading.set(false);
        }
      })
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
