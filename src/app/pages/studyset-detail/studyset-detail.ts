import { Component, OnInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StudySet } from '../../types';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import { Flashcard } from '../../components/common/flashcard/flashcard';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-studyset-detail',
  imports: [CommonModule, RouterModule, Flashcard, ButtonModule],
  templateUrl: './studyset-detail.html',
  styleUrl: './studyset-detail.scss'
})
export class StudySetDetailPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  studySet$: Observable<StudySet | null> = this.store.select(StudySetSelectors.selectSelectedStudySet);
  currentIndex = signal(0);
  studySet: StudySet | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(StudySetActions.loadStudySetById({ id }));
    }

    this.studySet$.pipe(takeUntil(this.destroy$)).subscribe(studySet => {
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

    if (event.key === 'ArrowLeft') {
      this.previous();
    } else if (event.key === 'ArrowRight') {
      this.next();
    }
  }

  previous(): void {
    if (!this.studySet) return;
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }

  next(): void {
    if (!this.studySet) return;
    if (this.currentIndex() < this.studySet.vocabularies.length - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  goToQuiz(): void {
    if (!this.studySet) return;
    this.router.navigate(['/quiz', this.studySet.id]);
  }
}
