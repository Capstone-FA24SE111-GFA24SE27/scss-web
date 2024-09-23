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
      getCounselingAppointmentRequests: build.query<GetCounselingAppointmentApiResponse, GetCounselingAppointmentApiArg>({
        query: ({ }) => ({
          url: `/api/booking-counseling/appointment-request?sortBy=requireDate&sortDirection=ASC&page=1`,
        }),
        providesTags: ['appointments']
      }),
    })
  })

export const {
  useGetCounselingAppointmentRequestsQuery,
} = activityApi


export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<Appointment>>
export type GetCounselingAppointmentApiArg = {

}

export type GetCounselorApiResponse = ApiResponse<Appointment>

export type Appointment = {
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


