import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TermEditor, TermRow } from '../term-editor/term-editor';
import { CreateStudySetRequest, StudySetDetail } from '../../../types';
import { Visibility } from '../../../types/enum';

export interface StudySetFormData {
  title: string;
  description: string;
  visibility: Visibility;
  terms: { term: string; definition: string }[];
}

@Component({
  selector: 'app-study-set-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    TermEditor,
  ],
  templateUrl: './study-set-form.html',
  styleUrl: './study-set-form.scss',
})
export class StudySetForm implements OnInit {
  @Input() initialData: StudySetDetail | null = null;
  @Input() submitLabel = 'Tạo bộ thẻ';
  @Input() isSubmitting = false;
  @Output() formSubmit = new EventEmitter<StudySetFormData>();

  title = '';
  description = '';
  visibility: Visibility = Visibility.PUBLIC;
  terms: TermRow[] = [];

  visibilityOptions = [
    { label: 'Công khai', value: Visibility.PUBLIC },
    { label: 'Riêng tư', value: Visibility.PRIVATE },
  ];

  ngOnInit(): void {
    if (this.initialData) {
      this.title = this.initialData.title;
      this.description = this.initialData.description || '';
      this.visibility = this.initialData.visibility;
    }
  }

  get initialTerms(): CreateStudySetRequest['terms'] {
    if (!this.initialData?.terms?.length) return undefined;
    return this.initialData.terms.map((t) => ({ term: t.term, definition: t.definition }));
  }

  onTermsChange(rows: TermRow[]): void {
    this.terms = rows;
  }

  onSubmit(): void {
    if (!this.title.trim()) return;
    const validTerms = this.terms.filter((t) => t.term.trim() && t.definition.trim());
    this.formSubmit.emit({
      title: this.title.trim(),
      description: this.description.trim(),
      visibility: this.visibility,
      terms: validTerms,
    });
  }
}
