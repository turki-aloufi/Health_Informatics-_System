import { DoctorProfile } from "./doctor-profile.model";
import { PatientProfile } from "./patient-profile.model";

export enum AppointmentStatus {
  Scheduled = 0,
  Completed = 1,
  Cancelled = 2
}
  
  export interface Appointment {
    appointmentId?: string;
    appointmentIdPublic?: string;
    patientId: string;
    doctorId: string;
    appointmentDateTime: Date;
    status: AppointmentStatus;
    notes?: string;
    patientProfile?: PatientProfile;
    doctorProfile?: DoctorProfile;
    patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  patientGender?: string;
  }