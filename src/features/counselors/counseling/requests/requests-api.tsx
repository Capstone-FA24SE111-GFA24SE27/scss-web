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
      // denyAppointmentRequest: build.query<unknown, string>({
      //   mutation: (requestId) => ({
      //     url: `/api/booking-counseling/deny/${requestId}`,
      //   }),
      //   providesTags: ['appointments']
      // }),
    })
  })

export const {
  useGetCounselingAppointmentRequestsQuery,
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


