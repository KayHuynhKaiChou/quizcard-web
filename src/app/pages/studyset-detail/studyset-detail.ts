import { Component, OnInit, OnDestroy, HostListener, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StudySetDetail, Term } from '../../types';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import { Flashcard } from '../../components/common/flashcard/flashcard';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-studyset-detail',
  imports: [CommonModule, RouterModule, Flashcard, ButtonModule],
  templateUrl: './studyset-detail.html',
  styleUrl: './studyset-detail.scss',
})
export class StudySetDetailPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  studySet$: Observable<StudySetDetail | null> = this.store.select(
    StudySetSelectors.selectSelectedStudySet
  );
  studySet: StudySetDetail | null = null;

  currentIndex = signal(0);
  showTermFirst = signal(true);
  isShuffled = signal(false);
  learnedIds = signal<Set<string>>(new Set());
  shuffledTerms = signal<Term[]>([]);

  // Computed: active terms list (shuffled or original)
  activeTerms = computed(() => {
    if (this.isShuffled() && this.shuffledTerms().length > 0) {
      return this.shuffledTerms();
    }
    return this.studySet?.terms ?? [];
  });

  learnedCount = computed(() => this.learnedIds().size);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(StudySetActions.loadStudySetById({ id }));
    }

    this.studySet$.pipe(takeUntil(this.destroy$)).subscribe((studySet) => {
      this.studySet = studySet;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(StudySetActions.clearSelectedStudySet());
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.studySet) return;
    if (event.key === 'ArrowLeft') this.previous();
    else if (event.key === 'ArrowRight') this.next();
  }

  previous(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  next(): void {
    const terms = this.activeTerms();
    if (this.currentIndex() < terms.length - 1) {
      this.currentIndex.update((i) => i + 1);
    }
  }

  // Fisher-Yates shuffle
  toggleShuffle(): void {
    if (!this.studySet) return;
    if (this.isShuffled()) {
      this.isShuffled.set(false);
      this.shuffledTerms.set([]);
    } else {
      const shuffled = [...this.studySet.terms];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      this.shuffledTerms.set(shuffled);
      this.isShuffled.set(true);
    }
    this.currentIndex.set(0);
  }

  toggleFlipOrder(): void {
    this.showTermFirst.update((v) => !v);
  }

  toggleLearned(): void {
    const terms = this.activeTerms();
    const currentTerm = terms[this.currentIndex()];
    if (!currentTerm) return;

    const newSet = new Set(this.learnedIds());
    if (newSet.has(currentTerm.id)) {
      newSet.delete(currentTerm.id);
    } else {
      newSet.add(currentTerm.id);
    }
    this.learnedIds.set(newSet);
  }

  isCurrentLearned(): boolean {
    const terms = this.activeTerms();
    const currentTerm = terms[this.currentIndex()];
    return currentTerm ? this.learnedIds().has(currentTerm.id) : false;
  }

  goToQuiz(): void {
    if (!this.studySet) return;
    this.router.navigate(['/quiz', this.studySet.id]);
  }
}
