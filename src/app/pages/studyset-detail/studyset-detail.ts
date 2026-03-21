import { Component, OnInit, OnDestroy, AfterViewChecked, HostListener, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { StudySetDetail, Term } from '../../types';
import { Visibility } from '../../types/enum';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { Flashcard } from '../../components/common/flashcard/flashcard';
import { TermViewToggle } from '../../components/common/term-view-toggle/term-view-toggle';
import { TermGrid } from '../../components/common/term-grid/term-grid';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { StudySetService } from '../../services/studyset.service';

@Component({
  selector: 'app-studyset-detail',
  imports: [CommonModule, RouterModule, Flashcard, TermViewToggle, TermGrid, ButtonModule, FormsModule, ConfirmDialogModule],
  templateUrl: './studyset-detail.html',
  styleUrl: './studyset-detail.scss',
})
export class StudySetDetailPage implements OnInit, OnDestroy, AfterViewChecked {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studySetService = inject(StudySetService);
  private confirmationService = inject(ConfirmationService);
  private destroy$ = new Subject<void>();

  constructor() {
    // Must be in constructor (injection context) for toObservable to work
    toObservable(this.searchQuery).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query.trim().length > 0) {
        this.runSearch(query.trim(), true);
      } else {
        this.searchResults.set([]);
        this.searchCursor.set(0);
        this.searchHasMore.set(false);
      }
    });
  }
  private scrollObserver: IntersectionObserver | null = null;
  private observedElement: Element | null = null;

  @ViewChild('scrollSentinel') scrollSentinelRef?: ElementRef<HTMLDivElement>;

  studySet$: Observable<StudySetDetail | null> = this.store.select(
    StudySetSelectors.selectSelectedStudySet
  );
  hasMoreTerms$: Observable<boolean> = this.store.select(
    StudySetSelectors.selectHasMoreTerms
  );
  isLoadingTerms$: Observable<boolean> = this.store.select(
    StudySetSelectors.selectIsLoadingTerms
  );
  studySet = signal<StudySetDetail | null>(null);
  isOwner = signal(false);
  currentUserId = signal<string | null>(null);

  // Show clone button: own sets (any visibility) OR public sets by others; hide private sets by others
  canClone = computed(() => {
    const ss = this.studySet();
    if (!ss) return false;
    if (this.isOwner()) return true;
    return ss.visibility === Visibility.PUBLIC;
  });

  currentIndex = signal(0);
  showTermFirst = signal(true);
  isShuffled = signal(false);
  learnedIds = signal<Set<string>>(new Set());
  shuffledTerms = signal<Term[]>([]);
  viewMode = signal<'flashcard' | 'grid'>('flashcard');

  // Search state
  searchQuery = signal('');
  searchField = signal<'term' | 'definition'>('term');
  searchResults = signal<Term[]>([]);
  searchCursor = signal<number>(0);
  searchHasMore = signal(false);
  isSearching = signal(false);

  isSearchMode = computed(() => this.searchQuery().trim().length > 0);

  // Computed: active terms list (search results, shuffled, or original)
  activeTerms = computed(() => {
    if (this.isSearchMode()) {
      return this.searchResults();
    }
    if (this.isShuffled() && this.shuffledTerms().length > 0) {
      return this.shuffledTerms();
    }
    return this.studySet()?.terms ?? [];
  });

  learnedCount = computed(() => this.learnedIds().size);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(StudySetActions.loadStudySetById({ id }));
    }

    combineLatest([
      this.studySet$,
      this.store.select(AuthSelectors.selectUser)
    ]).pipe(takeUntil(this.destroy$)).subscribe(([ss, user]) => {
      this.studySet.set(ss);
      this.currentUserId.set(user?.id ?? null);
      this.isOwner.set(!!ss && !!user && ss.userId === user.id);
    });

  }

  ngAfterViewChecked(): void {
    this.setupScrollObserver();
  }

  ngOnDestroy(): void {
    this.teardownScrollObserver();
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(StudySetActions.clearSelectedStudySet());
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.studySet()) return;
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

    // Check if we need to load more (e.g. reached the 19th term of a 20-term batch)
    // terms.length is usually a multiple of 20
    if (this.currentIndex() >= terms.length - 2) {
      this.triggerLoadMoreIfNeeded();
    }

    if (this.currentIndex() < terms.length - 1) {
      this.currentIndex.update((i) => i + 1);

      // Check again after advancing just in case
      if (this.currentIndex() >= terms.length - 2) {
        this.triggerLoadMoreIfNeeded();
      }
    } else {
      // If at the end of loaded terms but hasn't fully loaded, try to load more
      this.triggerLoadMoreIfNeeded();
    }
  }

  private triggerLoadMoreIfNeeded(): void {
    let hasMore = false;
    let isLoading = false;
    this.store.select(StudySetSelectors.selectHasMoreTerms).subscribe(v => hasMore = v).unsubscribe();
    this.store.select(StudySetSelectors.selectIsLoadingTerms).subscribe(v => isLoading = v).unsubscribe();

    if (hasMore && !isLoading) {
      this.loadMoreTerms();
    }
  }

  // Fisher-Yates shuffle
  toggleShuffle(): void {
    const currentSet = this.studySet();
    if (!currentSet) return;
    if (this.isShuffled()) {
      this.isShuffled.set(false);
      this.shuffledTerms.set([]);
    } else {
      const shuffled = [...currentSet.terms];
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

  onViewChange(mode: 'flashcard' | 'grid'): void {
    this.viewMode.set(mode);
    if (mode === 'flashcard') {
      this.clearSearch();
    }
  }

  goToQuiz(): void {
    const currentSet = this.studySet();
    if (!currentSet) return;
    this.router.navigate(['/quiz', currentSet.id]);
  }

  confirmDelete(): void {
    const currentSet = this.studySet();
    if (!currentSet) return;
    this.confirmationService.confirm({
      message: 'Xóa bộ thẻ này? Các thuật ngữ sẽ bị xóa theo.',
      header: 'Xác nhận xóa',
      icon: 'pi pi-trash',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(StudySetActions.deleteStudySet({ id: currentSet.id }));
      },
    });
  }

  cloneStudySet(): void {
    const currentSet = this.studySet();
    if (!currentSet) return;
    this.store.dispatch(StudySetActions.cloneStudySet({ id: currentSet.id }));
  }

  setSearchField(field: 'term' | 'definition'): void {
    this.searchField.set(field);
    const query = this.searchQuery().trim();
    if (query.length > 0) {
      this.runSearch(query, true);
    }
  }

  onSearchFieldChange(): void {
    const query = this.searchQuery().trim();
    if (query.length > 0) {
      this.runSearch(query, true);
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.searchCursor.set(0);
    this.searchHasMore.set(false);
  }

  loadMoreSearchResults(): void {
    const query = this.searchQuery().trim();
    if (query.length > 0) {
      this.runSearch(query, false);
    }
  }

  private runSearch(query: string, reset: boolean): void {
    const studySet = this.studySet();
    if (!studySet) return;

    if (reset) {
      this.searchCursor.set(0);
      this.searchResults.set([]);
    }

    this.isSearching.set(true);
    this.studySetService
      .searchTerms(studySet.id, query, this.searchField(), this.searchCursor(), 20)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page) => {
          if (reset) {
            this.searchResults.set(page.items);
          } else {
            this.searchResults.update(prev => [...prev, ...page.items]);
          }
          this.searchHasMore.set(page.hasMore);
          if (page.nextCursor !== null) {
            this.searchCursor.set(page.nextCursor);
          }
          this.isSearching.set(false);
        },
        error: () => {
          this.isSearching.set(false);
        }
      });
  }

  loadMoreTerms(): void {
    const currentSet = this.studySet();
    if (!currentSet) return;

    // Get current cursor from store
    this.store.select(StudySetSelectors.selectTermsCursor).subscribe(cursor => {
      this.store.dispatch(StudySetActions.loadStudySetTerms({
        id: currentSet.id,
        cursor: cursor ?? undefined
      }));
    }).unsubscribe();
  }

  private setupScrollObserver(): void {
    const el = this.scrollSentinelRef?.nativeElement;
    if (!el || this.observedElement === el) return;

    this.teardownScrollObserver();

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          this.triggerLoadMoreIfNeeded();
        }
      },
      { rootMargin: '200px' }
    );

    this.scrollObserver.observe(el);
    this.observedElement = el;
  }

  private teardownScrollObserver(): void {
    this.scrollObserver?.disconnect();
    this.scrollObserver = null;
    this.observedElement = null;
  }
}
