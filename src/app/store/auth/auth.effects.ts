import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      mergeMap((action) =>
        this.authService.login(action.credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error?.error?.message || 'Login failed',
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
          map((response) =>
            AuthActions.registerSuccess({
              message: response.message,
              userId: response.userId,
            })
          ),
          catchError((error) =>
            of(
              AuthActions.registerFailure({
                error: error?.error?.message || 'Registration failed',
              })
            )
          )
        )
      )
    )
  );
}
