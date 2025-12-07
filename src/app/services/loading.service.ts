import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Loading...');
  
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  message$: Observable<string> = this.messageSubject.asObservable();

  show(message: string = 'Loading...'): void {
    this.messageSubject.next(message);
    this.isLoadingSubject.next(true);
  }

  hide(): void {
    this.isLoadingSubject.next(false);
  }

  get isLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  get message(): string {
    return this.messageSubject.value;
  }
}
