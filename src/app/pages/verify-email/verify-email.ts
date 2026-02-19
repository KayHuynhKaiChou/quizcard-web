import { Component, inject, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'verify-email-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, MessageModule, ProgressSpinnerModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmailPage {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  isLoading$ = this.authService.isLoading$;
  error$ = this.authService.error$;
  token: string | null = null;

  constructor() {
    this.token = this.route.snapshot.queryParamMap.get('token');

    afterNextRender(() => {
      this.authService.clearError();
      if (this.token) {
        this.authService.verifyEmail(this.token);
      }
    });
  }

  retry(): void {
    if (this.token) {
      this.authService.clearError();
      this.authService.verifyEmail(this.token);
    }
  }
}
