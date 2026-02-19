import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  template: `
    <div class="search-toolbar">
      <div class="search-field">
        <i class="pi pi-search"></i>
        <input
          pInputText
          type="text"
          [placeholder]="placeholder"
          [(ngModel)]="searchValue"
          (ngModelChange)="searchChange.emit($event)"
        />
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    .search-toolbar { display: flex; gap: 0.75rem; align-items: center; }
    .search-field {
      position: relative; flex: 1;
      i { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: $text-secondary; font-size: 0.875rem; }
      input { width: 100%; padding-left: 2.25rem !important; background: $bg-secondary; border: 1px solid $border-color;
        color: $text-primary; border-radius: $radius-button;
        &::placeholder { color: $text-secondary; }
      }
    }
  `],
})
export class SearchToolbar {
  @Input() placeholder = 'Tìm kiếm...';
  @Output() searchChange = new EventEmitter<string>();
  searchValue = '';
}
