import { Account, PaginationContent } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'appointments'
] as const;


export const activityApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselingAppointment: build.query<GetCounselingAppointmentApiResponse, GetCounselingAppointmentApiArg>({
        query: ({ }) => ({
          url: `/api/booking-counseling/appointment?fromDate=2024-09-01&toDate=2024-10-30`,
        }),
        providesTags: ['appointments']
      }),
      getCounselingAppointmentRequests: build.query<GetCounselingAppointmentRequestsApiResponse, GetCounselingAppointmentApiArg>({
        query: ({ }) => ({
          url: `/api/booking-counseling/appointment-request?sortBy=requireDate&sortDirection=ASC&page=1`,
        }),
        providesTags: ['appointments']
      }),
      sendCouselingAppointmentFeedback: build.mutation<unknown, SendCouselingAppointmentFeedback>({
        query: (arg) => ({
          method: 'POST',
          url: `/api/booking-counseling/feedback/${arg.appointmentId}`,
          body: arg.feedback
        }),
        invalidatesTags: ['appointments']
      }),
    })
  })

export const {
  useGetCounselingAppointmentRequestsQuery,
  useSendCouselingAppointmentFeedbackMutation,
  useGetCounselingAppointmentQuery
} = activityApi


export type GetCounselingAppointmentRequestsApiResponse = ApiResponse<PaginationContent<AppointmentRequest>>
export type GetCounselingAppointmentRequestsApiArg = {
}


export type GetCounselingAppointmentApiResponse = ApiResponse<Appointment[]>
export type GetCounselingAppointmentApiArg = {

}

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
}


export type AppointmentFeedback = {
  id: number,
  rating: number,
  comment: string,
  appointmentId: number,
  createdAt: number,
}

export type GetCounselorApiResponse = ApiResponse<AppointmentRequest>

export type SendCouselingAppointmentFeedback = {
  appointmentId: number,
  feedback: Feedback
}

export type AppointmentRequest = {
  id: number,
  requireDate: string,
  startTime: string,
  endTime: string,
  status: 'APPROVED' | 'REJECTED' | 'PENDING',
  meetingType: 'ONLINE' | 'OFFLINE',
  reason: string,
  appointmentDetails: AppointmentDetails | null,
  counselor: {
    rating: string
  } & Account,
  student: {
    studentCode: string
  } & Account,
}

export type AppointmentDetails = {
  address: string
  meetUrl: string
}

export type Feedback = {
  comment: string,
  rating: number,
}


