// src/app/auth/models/auth.model.ts
export interface LoginCredentials {
    email: string;
    password: string;
  }
  export enum Gender {
    Male = 'Male',
    Female = 'Female'
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    doB: Date;
    ssn: string;
    gender: Gender;
    phoneNumber: string;
    address: string;
  }
  
  export interface AuthState {
    token: string | null;
    user: any | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginResponse {
  token: string;
  userId: string;
  }
