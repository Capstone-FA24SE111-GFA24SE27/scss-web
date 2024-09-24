import { Account, PaginationContent } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'appointments'
] as const;


export const requestsApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselingAppointmentRequests: build.query<GetCounselingAppointmentApiResponse, GetCounselingAppointmentApiArg>({
        query: ({ }) => ({
          url: `/api/booking-counseling/appointment-request?sortBy=requireDate&sortDirection=ASC&page=1`,
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
          url: `/api/booking-counseling/deny/approve/offline/${arg.requestId}`,
          body: arg.meetingDetails
        }),
        invalidatesTags: ['appointments']
      }),
      denyAppointmentRequest: build.mutation<unknown, string>({
        query: (requestId) => ({
          method: 'PUT',
          url: `/api/booking-counseling/deny/${requestId}`,
        }),
        invalidatesTags: ['appointments']
      }),
    })
  })

export const {
  useGetCounselingAppointmentRequestsQuery,
  useDenyAppointmentRequestMutation,
  useApproveAppointmentRequestOnlineMutation,
  useApproveAppointmentRequestOfflineMutation,
} = requestsApi


export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<Appointment>>
export type GetCounselingAppointmentApiArg = {

}

export type GetCounselorApiResponse = ApiResponse<Appointment>

export type Appointment = {
  id: number,
  requireDate: string,
  startTime: string,
  endTime: string,
  status: 'APPROVED' | 'DENIED' | 'WAITING',
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

export type ApproveCounselingAppointmentRequestOnlineArg = {
  requestId: string,
  meetingDetails : {
    meetUrl: string,
  }
}

export type ApproveCounselingAppointmentRequestOfflineArg = {
  requestId: string,
  meetingDetails : {
    address: string,
  }
}