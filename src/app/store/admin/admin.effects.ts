// src/app/store/admin/admin.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { DoctorService } from '../../services/admin-doctor.service';
import * as AdminActions from './admin.actions';

@Injectable()
export class AdminEffects {
  loadDoctors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadDoctors),
      switchMap(() => {
        if (!this.doctorService || !this.doctorService.getDoctors) {
          console.error('DoctorService or getDoctors is undefined');
          return of(AdminActions.loadDoctorsFailure({ error: 'DoctorService not available' }));
        }
        return this.doctorService.getDoctors().pipe(
          map((doctors) => AdminActions.loadDoctorsSuccess({ doctors })),
          catchError((error) =>
            of(AdminActions.loadDoctorsFailure({ error: error.message }))
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private doctorService: DoctorService
  ) {
    // Debug injection
    console.log('AdminEffects initialized. DoctorService:', this.doctorService);
  }
}