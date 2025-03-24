import { User } from "./user.model";

export enum NotificationStatus {
    Sent = 'Sent',
    Failed = 'Failed',
    Pending = 'Pending'
  }
  
  export interface Notification {
    notificationId?: string;
    userId: string;
    message: string;
    sentAt: Date;
    user?: User;
  }