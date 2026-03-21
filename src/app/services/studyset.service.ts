import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  StudySet,
  StudySetDetail,
  CreateStudySetRequest,
  UpdateStudySetRequest,
  Term,
  CreateTermRequest,
  UpdateTermRequest,
  RateStudySetRequest,
  Page,
  CursorPage,
} from '../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudySetService {
  private readonly API = environment.apiUrl;
  private http = inject(HttpClient);

  // Study Set CRUD
  getMyStudySets(page = 0, size = 20): Observable<Page<StudySet>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<StudySet>>(`${this.API}/study-sets`, { params });
  }

  getStudySetById(id: string): Observable<StudySetDetail> {
    return this.http.get<StudySetDetail>(`${this.API}/study-sets/${id}`);
  }

  createStudySet(data: CreateStudySetRequest): Observable<StudySetDetail> {
    return this.http.post<StudySetDetail>(`${this.API}/study-sets`, data);
  }

  updateStudySet(id: string, data: UpdateStudySetRequest): Observable<StudySetDetail> {
    return this.http.put<StudySetDetail>(`${this.API}/study-sets/${id}`, data);
  }

  deleteStudySet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/study-sets/${id}`);
  }

  cloneStudySet(id: string): Observable<StudySetDetail> {
    return this.http.post<StudySetDetail>(`${this.API}/study-sets/${id}/clone`, {});
  }

  // Term CRUD
  getTerms(id: string, cursor?: number, limit: number = 20): Observable<CursorPage<Term, number>> {
    let params = new HttpParams().set('limit', limit);
    if (cursor !== undefined && cursor !== null) {
      params = params.set('cursor', cursor);
    }
    return this.http.get<CursorPage<Term, number>>(`${this.API}/study-sets/${id}/terms`, { params });
  }

  searchTerms(
    studySetId: string,
    query: string,
    field: 'term' | 'definition',
    cursor: number,
    limit: number = 20
  ): Observable<CursorPage<Term, number>> {
    let params = new HttpParams().set('q', query).set('field', field).set('cursor', cursor).set('limit', limit);
    return this.http.get<CursorPage<Term, number>>(`${this.API}/study-sets/${studySetId}/terms/search`, { params });
  }
  addTerm(studySetId: string, data: CreateTermRequest): Observable<Term> {
    return this.http.post<Term>(`${this.API}/study-sets/${studySetId}/terms`, data);
  }

  updateTerm(id: string, data: UpdateTermRequest): Observable<Term> {
    return this.http.put<Term>(`${this.API}/terms/${id}`, data);
  }

  deleteTerm(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/terms/${id}`);
  }

  // Bookmark
  bookmarkStudySet(id: string): Observable<void> {
    return this.http.post<void>(`${this.API}/study-sets/${id}/bookmark`, {});
  }

  unbookmarkStudySet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/study-sets/${id}/bookmark`);
  }

  getMyBookmarks(page = 0, size = 20): Observable<Page<StudySet>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<StudySet>>(`${this.API}/users/me/bookmarks`, { params });
  }

  // Rating
  rateStudySet(id: string, data: RateStudySetRequest): Observable<StudySet> {
    return this.http.post<StudySet>(`${this.API}/study-sets/${id}/rate`, data);
  }
}
