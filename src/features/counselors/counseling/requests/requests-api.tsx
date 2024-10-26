import {  AppointmentRequest, PaginationContent } from '@shared/types';
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
      getCounselorAppointmentRequests: build.query<GetCounselingAppointmentApiResponse, GetCounselingAppointmentApiArg>({
        query: ({ }) => ({
          url: `/api/booking-counseling/appointment-request?sortBy=requireDate&sortDirection=ASC&page=1`,
        }),
        providesTags: ['appointments']
      }),
    })
  })

export const {
  useGetCounselorAppointmentRequestsQuery,
} = requestsApi


export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<AppointmentRequest>>
export type GetCounselingAppointmentApiArg = {

}
