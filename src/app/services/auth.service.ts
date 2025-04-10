// src/app/auth/services/auth.service.ts
import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
  BehaviorSubject,
  catchError,
  finalize,
  firstValueFrom,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs'
import {
  LoginCredentials,
  RegisterData,
  LoginResponse,
} from '../models/auth.model'
import { TokenService, TokenType } from './token.service'
import { Router } from '@angular/router'
import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5098/api/Auth'

  private currentUserSubject = new BehaviorSubject<any>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.initializeAuth()
  }

  private initializeAuth(): void {
    this.loadCurrentUser().subscribe({
      next: () => {},
      error: () => {
        localStorage.removeItem(TokenType.TOKEN)
        this.currentUserSubject.next(null)
      },
    })
  }

  login(loginData: LoginCredentials): Observable<any> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          // Store user and token
          localStorage.setItem(TokenType.TOKEN, response.token)
          this.currentUserSubject.next(response.user)
        }),
      )
  }

  register(registerData: RegisterData): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/create-patient-profile`,
      registerData,
    )
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user)
      }),
      map(response => response.user),
      catchError(error => {
        // Handle 401 or other errors
        this.logout()
        return throwError(() => error)
      }),
    )
  }

  logout(): void {
    localStorage.clear()
    this.currentUserSubject.next(null)
    this.router.navigate(['/login'])
  }

  getToken(): string | null {
    return localStorage.getItem(TokenType.TOKEN)
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }

  get isAuthenticated(): boolean {
    return (
      !!this.currentUserSubject.value && !!localStorage.getItem(TokenType.TOKEN)
    )
  }
}
