// src/app/auth/services/auth.service.ts
import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs'
import {
  LoginCredentials,
  RegisterData,
  LoginResponse,
} from '../models/auth.model'
import { TokenService, TokenType } from './token.service'
import { Router } from '@angular/router'

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
    const token = localStorage.getItem(TokenType.TOKEN)
    if (token) {
      this.loadCurrentUser().subscribe()
    }
  }

  login(loginData: LoginCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(userData => {
        console.log({ userData })
        this.currentUserSubject.next(userData.user)
      }),
    )
  }

  register(registerData: RegisterData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData)
  }

  loadCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap(userData => {
        this.currentUserSubject.next(userData)
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
  get currentUserValue(): any {
    return this.currentUserSubject.value
  }
}
