import { Injectable } from '@angular/core'

export enum TokenType {
  ACCESS_TOKEN = 'token',
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  getToken(type: TokenType): string | null {
    return localStorage.getItem(type)
  }

  setToken(type: TokenType, token: string) {
    return localStorage.setItem(type, token)
  }

  removeToken(type: TokenType) {
    return localStorage.removeItem(type)
  }
}
