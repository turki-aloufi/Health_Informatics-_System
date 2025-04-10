// src/app/auth/register/register.component.ts
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'

import { AuthActions } from '../../../store/auth/auth.actions'
import { AuthState, Gender } from '../../../models/auth.model'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class RegisterComponent {
  registerForm: FormGroup
  authState$: Observable<AuthState>
  genderOptions = Object.values(Gender)

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      doB: ['', Validators.required],
      ssn: ['', Validators.required],
      gender: [Gender.Male, Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
    })

    this.authState$ = this.store.select(state => state.auth)
  }

  // Getters for easy form control access
  get name() {
    return this.registerForm.get('name')
  }
  get email() {
    return this.registerForm.get('email')
  }
  get password() {
    return this.registerForm.get('password')
  }
  get doB() {
    return this.registerForm.get('doB')
  }
  get ssn() {
    return this.registerForm.get('ssn')
  }
  get gender() {
    return this.registerForm.get('gender')
  }
  get phoneNumber() {
    return this.registerForm.get('phoneNumber')
  }
  get address() {
    return this.registerForm.get('address')
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = { ...this.registerForm.value }

      // Convert the date string to a full ISO format with time set to midnight
      formValue.doB = new Date(formValue.doB).toISOString()

      // Convert gender to a number: Male = 0, Female = 1
      formValue.gender = formValue.gender === 'Male' ? 0 : 1

      // Dispatch the register action with the raw formValue matching RegisterData
      this.store.dispatch(
        AuthActions.registerRequest({ registerData: formValue }),
      )
    }
  }
}
