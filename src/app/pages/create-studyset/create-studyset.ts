import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as AiActions from '../../store/ai/ai.actions';
import * as AiSelectors from '../../store/ai/ai.selectors';
import { StudySetFormPage } from '../../components/common/study-set-form-page/study-set-form-page';
import { StudySetForm, StudySetFormData } from '../../components/common/study-set-form/study-set-form';
import { AiUsageBadge } from '../../components/common/ai-usage-badge/ai-usage-badge';
import { AiTermResponse, AiUsageResponse, CreateStudySetRequest } from '../../types';
import { Visibility } from '../../types/enum';

@Component({
  selector: 'app-create-studyset',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    InputTextModule, ButtonModule, SelectModule, TextareaModule,
    StudySetFormPage, StudySetForm, AiUsageBadge,
  ],
  templateUrl: './create-studyset.html',
  styleUrl: './create-studyset.scss',
})
export class CreateStudySetPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private sub = new Subscription();

  // Manual tab
  isSubmitting = signal(false);

  // AI tab
  usage = signal<AiUsageResponse | null>(null);
  generatedTerms = signal<AiTermResponse[]>([]);
  isLoading = signal(false);
  aiDisabled = computed(() => (this.usage()?.remaining ?? 1) === 0);

  // AI form fields
  prompt = '';
  count = 10;
  sourceLanguage = 'en';
  targetLanguage = 'vi';
  difficulty = 'intermediate';
  saveTitle = '';
  showSaveForm = signal(false);

  languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' },
    { label: '日本語', value: 'ja' },
    { label: '한국어', value: 'ko' },
  ];

  difficultyOptions = [
    { label: 'Cơ bản', value: 'beginner' },
    { label: 'Trung bình', value: 'intermediate' },
    { label: 'Nâng cao', value: 'advanced' },
  ];

  ngOnInit(): void {
    this.store.dispatch(AiActions.getAiUsage());

    this.sub.add(
      this.store.select(AiSelectors.selectAiUsage).subscribe((u) => this.usage.set(u))
    );
    this.sub.add(
      this.store.select(AiSelectors.selectGeneratedTerms).subscribe((t) => this.generatedTerms.set(t))
    );
    this.sub.add(
      this.store.select(AiSelectors.selectIsLoading).subscribe((l) => this.isLoading.set(l))
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.store.dispatch(AiActions.clearGeneratedTerms());
  }

  // Manual tab
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

  // AI tab
  generate(): void {
    if (!this.prompt.trim()) return;
    this.store.dispatch(AiActions.generateTerms({
      prompt: this.prompt.trim(),
      count: this.count,
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage,
      difficulty: this.difficulty,
      includeExamples: true,
      includeIpa: true,
    }));
  }

  removeTerm(index: number): void {
    this.generatedTerms.update((terms) => terms.filter((_, i) => i !== index));
  }

  openSaveForm(): void {
    this.showSaveForm.set(true);
  }

  saveAsStudySet(): void {
    const title = this.saveTitle.trim();
    if (!title || this.generatedTerms().length === 0) return;

    const request: CreateStudySetRequest = {
      title,
      description: `AI Generated: ${this.prompt.trim().substring(0, 100)}`,
      visibility: Visibility.PRIVATE,
      terms: this.generatedTerms().map((t) => ({
        term: t.term,
        definition: t.definition,
        ipa: t.ipa || undefined,
        exampleSentence: t.example || undefined,
        exampleTranslation: t.exampleTranslation || undefined,
      })),
    };
    this.store.dispatch(StudySetActions.createStudySet({ data: request }));
  }
}
