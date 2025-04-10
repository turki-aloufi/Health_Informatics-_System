import { DoctorProfile } from './doctor-profile.model'
import { PatientProfile } from './patient-profile.model'
import { Notification } from './notification.model'

export enum UserRole {
  Patient = 0,
  Doctor = 1,
  Admin = 2,
}

export enum Gender {
  Male = 0,
  Female = 1,
}

export interface CurrentUser {
  user: User
  patientProfile?: PatientProfile
}
export interface User {
  id?: string
  idPublic?: string
  name: string
  email: string
  role: UserRole
  password?: string
  doB: Date | string
  ssn: string
  gender: Gender
  phoneNumber?: string
  address?: string
  patientProfile?: PatientProfile
  doctorProfile?: DoctorProfile
  notifications?: Notification[]
}
