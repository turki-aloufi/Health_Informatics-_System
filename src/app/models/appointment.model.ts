import { DoctorProfile } from "./doctor-profile.model";
import { PatientProfile } from "./patient-profile.model";

export enum AppointmentStatus {
    Scheduled = 'Scheduled',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
  }
  
  export interface Appointment {
    appointmentId?: string;
    patientId: string;
    doctorId: string;
    appointmentDateTime: Date;
    status: AppointmentStatus;
    notes?: string;
    patientProfile?: PatientProfile;
    doctorProfile?: DoctorProfile;
  }