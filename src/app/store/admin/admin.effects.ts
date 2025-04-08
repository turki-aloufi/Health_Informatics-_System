// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { DoctorService } from '../../services/admin-doctor.service';
// import * as AdminActions from './admin.actions';
// import { map, switchMap } from 'rxjs/operators';

// @Injectable()
// export class AdminEffects {
//   loadDoctors$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AdminActions.loadDoctors),
//       switchMap(() => this.doctorService.getDoctors().pipe(map((doctors) => AdminActions.loadDoctorsSuccess({ doctors }))))
//     )
//   );

//   constructor(private actions$: Actions, private doctorService: DoctorService) {}
// }