import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchQuery: string = '';
  private router = inject(Router);
  sidebarService = inject(SidebarService);
  authService = inject(AuthService);
  
  isProfileDropdownOpen = false;
  
  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }
  
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
}

