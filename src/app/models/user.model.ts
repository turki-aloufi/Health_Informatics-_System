import { DoctorProfile } from "./doctor-profile.model";
import { PatientProfile } from "./patient-profile.model";

export enum UserRole {
    Patient = 'Patient',
    Doctor = 'Doctor',
    Admin = 'Admin'
  }
  
  export enum Gender {
    Male = 'Male',
    Female = 'Female'
  }
  
  export interface User {
    id?: string;
    name: string;
    email: string;
    role: UserRole;
    password?: string; // Optional in frontend, required only during creation
    dob: Date;
    ssn: string;
    gender: Gender;
    phoneNumber?: string;
    address?: string;
    patientProfile?: PatientProfile;
    doctorProfile?: DoctorProfile;
    notifications?: Notification[];
  }