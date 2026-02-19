import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import { StudySetForm, StudySetFormData } from '../../components/common/study-set-form/study-set-form';
import { CreateStudySetRequest } from '../../types';

@Component({
  selector: 'app-create-studyset',
  standalone: true,
  imports: [CommonModule, StudySetForm],
  templateUrl: './create-studyset.html',
  styleUrl: './create-studyset.scss',
})
export class CreateStudySetPage {
  private store = inject(Store<AppState>);
  isSubmitting = signal(false);

  onFormSubmit(data: StudySetFormData): void {
    this.isSubmitting.set(true);
    const request: CreateStudySetRequest = {
      title: data.title,
      description: data.description || undefined,
      visibility: data.visibility,
      terms: data.terms.map((t) => ({ term: t.term, definition: t.definition })),
    };
    this.store.dispatch(StudySetActions.createStudySet({ data: request }));
  }
}
