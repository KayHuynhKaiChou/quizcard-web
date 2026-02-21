import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  @Input() showAuthor = false;
  @Input() hideVisibility = false;
}
