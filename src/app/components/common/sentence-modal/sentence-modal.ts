import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  effect,
  untracked,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AiSentence, Term } from '../../../types';
import { AppState } from '../../../store/app.state';
import * as AiActions from '../../../store/ai/ai.actions';
import * as AiSelectors from '../../../store/ai/ai.selectors';
import * as SavedSentenceActions from '../../../store/saved-sentence/saved-sentence.actions';
import * as SavedSentenceSelectors from '../../../store/saved-sentence/saved-sentence.selectors';

const SENTENCE_COUNT = 10;

/**
 * Sentence picker. Hosted once by the study set detail page; both the flashcard
 * view and the grid view feed it the term to work on.
 */
@Component({
  selector: 'app-sentence-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, CheckboxModule],
  templateUrl: './sentence-modal.html',
  styleUrl: './sentence-modal.scss',
})
export class SentenceModal implements OnDestroy {
  private store = inject(Store<AppState>);
  private actions$ = inject(Actions);
  private destroy$ = new Subject<void>();
  /** Re-pointed at a different term's cache each time the input changes. */
  private sentencesSub?: Subscription;

  private _term = signal<Term | null>(null);

  @Input() set term(value: Term | null) {
    this._term.set(value);
  }

  @Output() closed = new EventEmitter<void>();

  sentences = signal<AiSentence[] | undefined>(undefined);
  loadingTermId = signal<string | null>(null);
  error = signal<string | null>(null);
  isSaving = signal(false);

  /** Indexes into `sentences()` the user ticked. */
  selected = signal<Set<number>>(new Set());

  currentTerm = computed(() => this._term());
  visible = computed(() => this._term() !== null);
  isLoading = computed(() => this.loadingTermId() === this._term()?.id);
  selectedCount = computed(() => this.selected().size);

  allSelected = computed(() => {
    const list = this.sentences();
    return !!list && list.length > 0 && this.selected().size === list.length;
  });

  constructor() {
    this.store
      .select(AiSelectors.selectSentencesLoadingTermId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => this.loadingTermId.set(id));

    this.store
      .select(AiSelectors.selectSentencesError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((err) => this.error.set(err));

    this.store
      .select(SavedSentenceSelectors.selectIsSaving)
      .pipe(takeUntil(this.destroy$))
      .subscribe((saving) => this.isSaving.set(saving));

    // Close only on a confirmed save; a failed save keeps the picks on screen.
    this.actions$
      .pipe(ofType(SavedSentenceActions.saveSentencesSuccess), takeUntil(this.destroy$))
      .subscribe(() => this.close());

    // On term change: reset selection, follow that term's cache, and call the
    // API only when the cache is empty.
    effect(() => {
      const term = this._term();
      untracked(() => {
        if (!term) {
          this.sentencesSub?.unsubscribe();
          this.sentences.set(undefined);
          return;
        }
        this.selected.set(new Set());
        this.watchSentences(term.id);
        this.generateIfMissing(term);
      });
    });
  }

  ngOnDestroy(): void {
    this.sentencesSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private watchSentences(termId: string): void {
    this.sentencesSub?.unsubscribe();
    this.sentencesSub = this.store
      .select(AiSelectors.selectSentencesForTerm(termId))
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => this.sentences.set(list));
  }

  private generateIfMissing(term: Term): void {
    // Store selectors emit synchronously, so this reads the current cache.
    let cached: AiSentence[] | undefined;
    this.store
      .select(AiSelectors.selectSentencesForTerm(term.id))
      .subscribe((v) => (cached = v))
      .unsubscribe();

    if (!cached) {
      this.dispatchGenerate(term);
    }
  }

  private dispatchGenerate(term: Term): void {
    this.store.dispatch(
      AiActions.generateSentences({
        termId: term.id,
        term: term.term,
        count: SENTENCE_COUNT,
      })
    );
  }

  toggle(index: number): void {
    const next = new Set(this.selected());
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    this.selected.set(next);
  }

  toggleAll(): void {
    const list = this.sentences();
    if (!list) return;
    this.selected.set(this.allSelected() ? new Set() : new Set(list.map((_, i) => i)));
  }

  regenerate(): void {
    const term = this._term();
    if (!term) return;
    this.selected.set(new Set());
    this.store.dispatch(AiActions.clearSentencesForTerm({ termId: term.id }));
    this.dispatchGenerate(term);
  }

  retry(): void {
    const term = this._term();
    if (term) this.dispatchGenerate(term);
  }

  save(): void {
    const list = this.sentences();
    if (!list || this.selected().size === 0) return;
    const picked = list.filter((_, i) => this.selected().has(i));
    this.store.dispatch(SavedSentenceActions.saveSentences({ sentences: picked }));
  }

  close(): void {
    this.closed.emit();
  }

  onVisibleChange(open: boolean): void {
    if (!open) this.close();
  }
}
