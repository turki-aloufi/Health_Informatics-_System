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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5098/api/Auth'

  private currentUserSubject = new BehaviorSubject<any>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient, private tokenService: TokenService) {
    const token = localStorage.getItem(TokenType.ACCESS_TOKEN)
    if (token) {
      this.loadCurrentUser().subscribe()
    }
  }

  login(loginData: LoginCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/Auth/login`, loginData).pipe(
      tap(response => {
        if (response && response.token) {
          this.tokenService.setToken(TokenType.ACCESS_TOKEN, response.token)
          this.loadCurrentUser().subscribe()
        }
      }),
    )
  }

  register(registerData: RegisterData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData)
  }

  loadCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/Auth/current-user`).pipe(
      tap(userData => {
        this.currentUserSubject.next(userData)
      }),
    )
  }
  logout(): void {
    localStorage.removeItem('token')
    this.currentUserSubject.next(null)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }
  get currentUserValue(): any {
    return this.currentUserSubject.value
  }
}
