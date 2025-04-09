import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { catchError, map, mergeMap, tap } from 'rxjs/operators'
import { AuthService } from '../../services/auth.service'
import {
  AuthActions,
  loadAuthStateSuccess,
  loadAuthStateFailure,
} from './auth.actions'
import { TokenType } from '@/app/services/token.service'
import { UserRole } from '@/app/models/user.model'

interface JwtPayload {
  role: string
  // include other properties if needed
}

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)
  private router = inject(Router)

  // Login effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      mergeMap(action =>
        this.authService.login(action.credentials).pipe(
          mergeMap(response => [AuthActions.loginSuccess({ response })]),
          catchError(error =>
            of(
              AuthActions.loginFailure({
                error: error?.error?.message || 'Login failed',
              }),
            ),
          ),
        ),
      ),
    ),
  )

  // Save token to localStorage after successful login, decode token for role
  saveToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          localStorage.setItem(TokenType.TOKEN, response.token)
          if (response.user.id) localStorage.setItem('userId', response.user.id)

          let role = ''
          switch (response.user.role) {
            case UserRole.Patient:
              role = 'patient'
              break
            case UserRole.Doctor:
              role = 'doctor'
              break
            case UserRole.Admin:
              role = 'admin'
              break
            default:
              role = 'Unknown'
          }

          localStorage.setItem('userRole', role)

          // Navigate based on the decoded role
          this.router.navigate([`/${role}/dashboard`])
        }),
      ),
    { dispatch: false },
  )

  // Load token from localStorage when the app initializes
  initAuth$ = createEffect(() =>
    of(null).pipe(
      map(() => {
        const token = localStorage.getItem(TokenType.TOKEN)
        const userId = localStorage.getItem('userId')
        const role = localStorage.getItem('userRole')

        if (token && userId && role) {
          return loadAuthStateSuccess({
            response: { token, userId, role },
          })
        }

        return loadAuthStateFailure()
      }),
    ),
  )

  // Register effect
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerRequest),
      mergeMap(action =>
        this.authService.register(action.registerData).pipe(
          mergeMap(response => [
            AuthActions.registerSuccess({
              message: response.message,
              userId: response.userId,
            }),
          ]),
          catchError(error =>
            of(
              AuthActions.registerFailure({
                error: error?.error?.message || 'Registration failed',
              }),
            ),
          ),
        ),
      ),
    ),
  )

  // Navigate to login after successful registration
  registerRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  )

  // Logout effect: clear localStorage and navigate to login
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem(TokenType.TOKEN)
          localStorage.removeItem('userId')
          localStorage.removeItem('userRole')
          this.router.navigate(['/login'])
        }),
      ),
    { dispatch: false },
  )
}
