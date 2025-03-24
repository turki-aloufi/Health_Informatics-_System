import { DoctorProfile } from "./doctor-profile.model";

export interface DoctorAvailability {
    availabilityId?: string;
    doctorId: string;
    dayOfWeek: number; // 1 = Monday, 7 = Sunday
    startTime: string; // Using string for simplicity; adjust if backend uses TimeSpan
    endTime: string;
    doctorProfile?: DoctorProfile;
  }