import { DoctorProfile } from "./doctor-profile.model";

export interface DoctorAvailability {
  availabilityId?: number;
  availabilityIdPublic?: string;
  doctorId?: number | string;
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  startTime: string; // Matches backend's TimeSpan format
  endTime: string;   // Matches backend's TimeSpan format
  doctorProfile?: DoctorProfile;
}