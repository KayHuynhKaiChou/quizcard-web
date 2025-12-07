import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    console.log('Create clicked');
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

  onClickOutside(): void {
    this.isProfileDropdownOpen = false;
  }
}

