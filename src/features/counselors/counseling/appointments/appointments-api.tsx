import { Account, PaginationContent } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'appointments'
] as const;


export const appointmentsApi = api
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
      approveAppointmentRequestOnline: build.mutation<unknown, ApproveCounselingAppointmentRequestOnlineArg>({
        query: (arg) => ({
          method: 'PUT',
          url: `/api/booking-counseling/approve/online/${arg.requestId}`,
          body: arg.meetingDetails
        }),
        invalidatesTags: ['appointments']
      }),
      approveAppointmentRequestOffline: build.mutation<unknown, ApproveCounselingAppointmentRequestOfflineArg>({
        query: (arg) => ({
          method: 'PUT',
          url: `/api/booking-counseling/approve/offline/${arg.requestId}`,
          body: arg.meetingDetails
        }),
        invalidatesTags: ['appointments']
      }),
      denyAppointmentRequest: build.mutation<unknown, number>({
        query: (requestId) => ({
          method: 'PUT',
          url: `/api/booking-counseling/deny/${requestId}`,
        }),
        invalidatesTags: ['appointments']
      }),
      updateAppointmentDetails: build.mutation<unknown, UpdateAppointmentDetailsArg>({
        query: (arg) => ({
          method: 'PUT',
          url: `/api/booking-counseling/${arg.requestId}/update-details`,
          body: arg.meetingDetails
        }),
        invalidatesTags: ['appointments']
      }),
      takeAppointmentAttendance: build.mutation<unknown, TakeAppointmentAttendance>({
        query: (arg) => ({
          method: 'PUT',
          url: `/api/booking-counseling/take-attendance/${arg.appointmentId}/${arg.counselingAppointmentStatus}`,
        }),
        invalidatesTags: ['appointments']
      }),
    })
  })

export const {
  useGetCounselingAppointmentQuery,
  useDenyAppointmentRequestMutation,
  useApproveAppointmentRequestOnlineMutation,
  useApproveAppointmentRequestOfflineMutation,
  useUpdateAppointmentDetailsMutation,
  useTakeAppointmentAttendanceMutation
} = appointmentsApi


export type GetCounselingAppointmentApiResponse = ApiResponse<Appointment[]>
export type GetCounselingAppointmentApiArg = {

}

export type GetCounselorApiResponse = ApiResponse<Appointment>

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

export type AppointmentDetails = {
  address: string
  meetUrl: string
}

export type ApproveCounselingAppointmentRequestOnlineArg = {
  requestId: number,
  meetingDetails: {
    meetUrl?: string,
  }
}

export type ApproveCounselingAppointmentRequestOfflineArg = {
  requestId: number,
  meetingDetails: {
    address?: string,
  }
}

export type UpdateAppointmentDetailsArg = {
  requestId: number,
  meetingDetails: Partial<AppointmentDetails>
}

export type TakeAppointmentAttendance = {
  appointmentId: number,
  counselingAppointmentStatus: 'CANCELED' | 'ATTEND' | 'ABSENT' | 'EXPIRED' | 'WAITING'
}

export type AppointmentAttendanceStatus = 'CANCELED' | 'ATTEND' | 'ABSENT' | 'EXPIRED' | 'WAITING'

export type AppointmentFeedback = {
  id: number,
  rating: number,
  comment: string,
  appointmentId: number,
  createdAt: number,
}