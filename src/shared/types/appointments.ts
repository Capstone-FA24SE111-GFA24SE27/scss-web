import { Account } from "@shared/types";

export type Appointment = {
  id: number,
  requireDate: string,
  startDateTime: string,
  endDateTime: string,
  status: string,
  meetingType: 'ONLINE' | 'OFFLINE',
  reason: string,
  meetUrl?: string,
  address?: string,
  counselorInfo: null | {
    rating: string
  } & Account,
  studentInfo: null | {
    studentCode: string
  } & Account,
  appointmentFeedback: AppointmentFeedback
  havingReport: boolean;
}


export type AppointmentFeedback = {
  id: number,
  rating: number,
  comment: string,
  appointmentId: number,
  createdAt: number,
}