import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'signin-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class SigninPage implements OnInit, OnDestroy {
  form!: FormGroup;

  private formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  isLoading$ = this.authService.isLoading$;
  error$ = this.authService.error$;

  private valueSub?: Subscription;

  ngOnInit(): void {
    // Clear stale errors from previous page (e.g. navigating from signup)
    this.authService.clearError();

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Clear stale API error whenever user edits the form
    this.valueSub = this.form.valueChanges.subscribe(() => {
      this.authService.clearError();
    });
  }

  ngOnDestroy(): void {
    this.valueSub?.unsubscribe();
  }

  signin(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsDirty();
      });
      return;
    }
    const { email, password } = this.form.value;
    this.authService.login({ email, password });
  }
}
