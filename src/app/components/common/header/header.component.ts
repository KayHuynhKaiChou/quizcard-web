import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidebarService } from '../../../services/sidebar.service';
import { AuthService } from '../../../services/auth.service';
import { AppState } from '../../../store/app.state';
import * as AuthSelectors from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchQuery: string = '';
  private router = inject(Router);
  private store = inject(Store<AppState>);
  sidebarService = inject(SidebarService);
  authService = inject(AuthService);

  isProfileDropdownOpen = false;

  currentUser$ = this.store.select(AuthSelectors.selectUser);
  
  onMenuClick(): void {
    this.sidebarService.toggle(); // Toggle sidebar
  }

  onCreateClick(): void {
    this.router.navigate(['/create-set']);
  }

  onUpgradeClick(): void {
    console.log('Upgrade clicked');
  }

  onProfileClick(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  onLogout(): void {
    this.authService.logout();
    this.isProfileDropdownOpen = false;
  }

  onNavigateProfile(): void {
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  onClickOutside(): void {
    this.isProfileDropdownOpen = false;
  }

  onSearchSubmit(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { query } });
    }
  }
}

