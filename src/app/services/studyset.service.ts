import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StudySet, Vocabulary } from '../types';

// Import fake data files
// @ts-ignore
import hiraganaData from '../fakeData/hiragana.js';
// @ts-ignore
import kanjiData from '../fakeData/kanji.js';
// @ts-ignore
import toeicData from '../fakeData/toeic.js';
// @ts-ignore
import toeicv1Data from '../fakeData/toeicv1.js';
// @ts-ignore
import toeicv2Data from '../fakeData/toeicv2.js';
// @ts-ignore
import toeicv3Data from '../fakeData/toeicv3.js';
// @ts-ignore
import toeicv4Data from '../fakeData/toeicv4.js';
// @ts-ignore
import toeicIIGData from '../fakeData/toeicIIG.js';

interface RawVocabulary {
  tv: string;
  mean: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudySetService {
  private studySets: StudySet[] = [];

  constructor() {
    this.initializeStudySets();
  }

  private initializeStudySets(): void {
    const rawDataSets = [
      { name: 'hiragana', data: hiraganaData, author: 'Le Kim Tan', mode: 'public' as const },
      { name: 'kanji', data: kanjiData, author: 'Le Kim Tan', mode: 'public' as const },
      { name: 'toeic', data: toeicData, author: 'Le Kim Tan', mode: 'public' as const },
      { name: 'toeicv1', data: toeicv1Data, author: 'Le Kim Tan', mode: 'public' as const },
      { name: 'toeicv2', data: toeicv2Data, author: 'Le Kim Tan', mode: 'public' as const },
      { name: 'toeicv3', data: toeicv3Data, author: 'Le Kim Tan', mode: 'public' as const },
      { name: 'toeicv4', data: toeicv4Data, author: 'Le Kim Tan', mode: 'public' as const },
      { name: 'toeicIIG', data: toeicIIGData, author: 'Le Kim Tan', mode: 'public' as const },
    ];

    this.studySets = rawDataSets.map((rawSet, index) => ({
      id: `set-${index + 1}`,
      title: this.formatTitle(rawSet.name),
      author: rawSet.author,
      mode: rawSet.mode,
      createdAt: new Date(2024, 0, index + 1).toISOString(),
      vocabularies: this.convertVocabularies(rawSet.data)
    }));
  }

  private formatTitle(name: string): string {
    const titleMap: Record<string, string> = {
      'hiragana': 'Japanese Hiragana',
      'kanji': 'Japanese Kanji',
      'toeic': 'TOEIC Vocabulary',
      'toeicv1': 'TOEIC Vocabulary Part 1',
      'toeicv2': 'TOEIC Vocabulary Part 2',
      'toeicv3': 'TOEIC Vocabulary Part 3',
      'toeicv4': 'TOEIC Vocabulary Part 4',
      'toeicIIG': 'TOEIC IIG Vocabulary',
    };
    return titleMap[name] || name;
  }

  private convertVocabularies(rawData: RawVocabulary[]): Vocabulary[] {
    return rawData.map((item, index) => ({
      id: `vocab-${index + 1}`,
      term: item.tv,
      definition: item.mean
    }));
  }

  getAllStudySets(): Observable<StudySet[]> {
    return of(this.studySets);
  }

  getStudySetById(id: string): Observable<StudySet | undefined> {
    const studySet = this.studySets.find(set => set.id === id);
    return of(studySet);
  }

  getPublicStudySets(): Observable<StudySet[]> {
    const publicSets = this.studySets.filter(set => set.mode === 'public');
    return of(publicSets);
  }
}
