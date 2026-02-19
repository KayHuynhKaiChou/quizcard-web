import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'forgot-password-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordPage implements OnInit, OnDestroy {
  form!: FormGroup;
  emailSent = signal(false);

  private formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  isLoading$ = this.authService.isLoading$;
  error$ = this.authService.error$;

  private valueSub?: Subscription;

  ngOnInit(): void {
    this.authService.clearError();

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.valueSub = this.form.valueChanges.subscribe(() => {
      this.authService.clearError();
    });
  }

  ngOnDestroy(): void {
    this.valueSub?.unsubscribe();
  }

  submit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsDirty();
      });
      return;
    }
    const { email } = this.form.value;
    this.authService.forgotPassword({ email });
    this.emailSent.set(true);
  }
}
