// src/app/auth/services/auth.service.ts
import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom, Observable } from 'rxjs'
import {
  LoginCredentials,
  RegisterData,
  LoginResponse,
} from '../models/auth.model'
import { TokenService, TokenType } from './token.service'
import { User } from '../models/user.model'

const initialState: CurrentUser = {
  isAuthenticated: false,
  roles: [],
}
export type CurrentUser = {
  user?: User
  isAuthenticated: boolean
  roles: string[]
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5098/api/Auth'
  private readonly _currentUser = signal<CurrentUser>(initialState)

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
  }

  register(registerData: RegisterData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData)
  }

  // async init(): Promise<void> {
  //   try {
  //     const token = this.tokenService.getToken(TokenType.ACCESS_TOKEN)

  //     if (token) {
  //       await this.refreshCurrentUser()
  //     } else {
  //       this.resetCurrentUser()
  //     }
  //   } catch (error) {
  //     console.error('Auth initialization failed:', error)
  //     this.resetCurrentUser()
  //   }
  // }

  // async refreshCurrentUser(): Promise<void> {
  //   if (!this.tokenService.getToken(TokenType.ACCESS_TOKEN)) {
  //     this.resetCurrentUser()
  //     return
  //   }

  //   try {
  //     const response = await firstValueFrom(this.userService.current())
  //     this._currentUser.set({
  //       user: response.data,
  //       isAuthenticated: true,
  //       roles: response.data.roles,
  //     })
  //   } catch (error) {
  //     console.error('Failed to refresh user:', error)
  //     this.resetCurrentUser()
  //   }
  // }

  // private resetCurrentUser(): void {
  //   this._currentUser.set({
  //     ...initialState,
  //   })
  // }
}
