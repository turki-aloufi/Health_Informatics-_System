import { Appointment } from "./appointment.model";
import { DoctorAvailability } from "./doctor-availability.model";

export interface DoctorProfile {
    userId: string;
    specialty: string;
    licenseNumber: string;
    clinic?: string;
    availabilities?: DoctorAvailability[];
    appointments?: Appointment[];
  }