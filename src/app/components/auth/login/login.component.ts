// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions } from '../../../store/auth/auth.actions';
import { AuthState } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  authState$: Observable<AuthState>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.authState$ = this.store.select(state => state.auth);
  }

  // Getter for easy access to form controls
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.store.dispatch(AuthActions.loginRequest({ 
        credentials: this.loginForm.value 
      }));
    }
  }
}