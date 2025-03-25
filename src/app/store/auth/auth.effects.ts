import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      mergeMap((action) =>
        this.authService.login(action.credentials).pipe(
          mergeMap((response) => [
            AuthActions.loginSuccess({ response })
          ]),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error?.error?.message || 'Login failed'
              })
            )
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerRequest),
      mergeMap((action) =>
        this.authService.register(action.registerData).pipe(
          mergeMap((response) => [
            AuthActions.registerSuccess({
              message: response.message,
              userId: response.userId
            })
          ]),
          catchError((error) =>
            of(
              AuthActions.registerFailure({
                error: error?.error?.message || 'Registration failed'
              })
            )
          )
        )
      )
    )
  );

  // After a successful registration, navigate to the login page
  registerRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
}
