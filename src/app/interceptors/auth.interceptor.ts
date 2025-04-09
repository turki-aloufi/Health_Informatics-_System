import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service'

// export const authInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<unknown>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<unknown>> => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const token = authService.getToken();

//   if (token) {
//     // Clone the request and add the authorization header
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       // Handle 401 Unauthorized errors - token expired or invalid
//       if (error.status === 401) {
//         authService.logout();
//         router.navigate(['/login']);
//       }
//       return throwError(() => error);
//     })
//   );
// };
