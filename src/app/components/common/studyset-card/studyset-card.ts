import { Component, Input, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { StudySet } from '../../../types';
import { Visibility } from '../../../types/enum';
import { AppState } from '../../../store/app.state';
import * as StudySetActions from '../../../store/studyset/studyset.actions';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-studyset-card',
  imports: [CommonModule, RouterModule, BadgeModule, CardModule, ButtonModule],
  templateUrl: './studyset-card.html',
  styleUrl: './studyset-card.scss',
})
export class StudysetCard {
  @Input() studySet!: StudySet;
  @Input() hideVisibility = false;

  private router = inject(Router);
  private store = inject(Store<AppState>);

  currentUserId = signal<string | null>(null);

  constructor() {
    this.store.select(AuthSelectors.selectUser)
      .pipe(takeUntilDestroyed())
      .subscribe(user => this.currentUserId.set(user?.id ?? null));
  }

  get canClone(): boolean {
    if (!this.studySet) return false;
    const isOwner = this.studySet.userId === this.currentUserId();
    if (isOwner) return true;
    return this.studySet.visibility === Visibility.PUBLIC;
  }

  navigateToAuthor(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.studySet.userId) {
      this.router.navigate(['/user', this.studySet.userId]);
    }
  }

  cloneStudySet(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.store.dispatch(StudySetActions.cloneStudySet({ id: this.studySet.id }));
  }
}
