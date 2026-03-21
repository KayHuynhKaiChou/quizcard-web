import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StudySet } from '../../../types';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-studyset-card',
  imports: [CommonModule, RouterModule, BadgeModule, CardModule],
  templateUrl: './studyset-card.html',
  styleUrl: './studyset-card.scss',
})
export class StudysetCard {
  @Input() studySet!: StudySet;
  @Input() hideVisibility = false;

  private router = inject(Router);

  navigateToAuthor(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.studySet.userId) {
      this.router.navigate(['/user', this.studySet.userId]);
    }
  }
}
