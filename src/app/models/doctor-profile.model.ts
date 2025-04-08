import { Appointment } from "./appointment.model";
import { DoctorAvailability } from "./doctor-availability.model";
import { User } from "./user.model";

export interface DoctorProfile extends User {

    specialty: string;
    licenseNumber: string;
    clinic?: string;
    availabilities?: DoctorAvailability[];
    appointments?: Appointment[];
  }