import { Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AppState } from '../../store/app.state';
import * as AiActions from '../../store/ai/ai.actions';
import * as AiSelectors from '../../store/ai/ai.selectors';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import { AiUsageBadge } from '../../components/common/ai-usage-badge/ai-usage-badge';
import { AiTermResponse, AiUsageResponse, CreateStudySetRequest } from '../../types';
import { Visibility } from '../../types/enum';

@Component({
  selector: 'app-ai-generate',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    InputTextModule, ButtonModule, SelectModule, TextareaModule,
    AiUsageBadge,
  ],
  templateUrl: './ai-generate.html',
  styleUrl: './ai-generate.scss',
})
export class AiGeneratePage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private sub = new Subscription();

  // Form fields
  prompt = '';
  count = 10;
  sourceLanguage = 'en';
  targetLanguage = 'vi';
  difficulty = 'intermediate';

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

  // State
  usage = signal<AiUsageResponse | null>(null);
  generatedTerms = signal<AiTermResponse[]>([]);
  isLoading = signal(false);
  saveTitle = '';
  showSaveForm = signal(false);

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
