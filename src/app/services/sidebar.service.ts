import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Signal để track sidebar state (true = open, false = collapsed)
  private _isOpen = signal<boolean>(true);
  
  // Public readonly signal
  readonly isOpen: Signal<boolean> = this._isOpen.asReadonly();
  
  // Getter for template compatibility
  get isOpenValue(): boolean {
    return this._isOpen();
  }
  
  toggle(): void {
    this._isOpen.update(value => !value);
  }
  
  open(): void {
    this._isOpen.set(true);
  }
  
  close(): void {
    this._isOpen.set(false);
  }
}

