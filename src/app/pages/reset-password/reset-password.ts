import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'reset-password-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    PasswordModule,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPasswordPage implements OnInit, OnDestroy {
  form!: FormGroup;
  token = '';
  invalidToken = signal(false);

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  authService = inject(AuthService);

  isLoading$ = this.authService.isLoading$;
  error$ = this.authService.error$;

  private valueSub?: Subscription;

  ngOnInit(): void {
    this.authService.clearError();

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.invalidToken.set(true);
      return;
    }

    this.form = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );

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
    const { newPassword } = this.form.value;
    this.authService.resetPassword({ token: this.token, newPassword });
  }
}
