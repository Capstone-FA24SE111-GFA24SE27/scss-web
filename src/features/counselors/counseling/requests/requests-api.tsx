import {  AppointmentRequest, PaginationContent } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'appointments-request'
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
        providesTags: ['appointments-request']
      }),
      // approveAppointmentRequestOnline: build.mutation<unknown, ApproveCounselingAppointmentRequestOnlineArg>({
      //   query: (arg) => ({
      //     method: 'PUT',
      //     url: `/api/booking-counseling/approve/online/${arg.requestId}`,
      //     body: arg.meetingDetails
      //   }),
      //   invalidatesTags: ['appointments']
      // }),
      // approveAppointmentRequestOffline: build.mutation<unknown, ApproveCounselingAppointmentRequestOfflineArg>({
      //   query: (arg) => ({
      //     method: 'PUT',
      //     url: `/api/booking-counseling/approve/offline/${arg.requestId}`,
      //     body: arg.meetingDetails
      //   }),
      //   invalidatesTags: ['appointments']
      // }),
      // denyAppointmentRequest: build.mutation<unknown, number>({
      //   query: (requestId) => ({
      //     method: 'PUT',
      //     url: `/api/booking-counseling/deny/${requestId}`,
      //   }),
      //   invalidatesTags: ['appointments']
      // }),
      // updateAppointmentDetails: build.mutation<unknown, UpdateAppointmentDetailsArg>({
      //   query: (arg) => ({
      //     method: 'PUT',
      //     url: `/api/booking-counseling/${arg.requestId}/update-details`,
      //     body: arg.meetingDetails
      //   }),
      //   invalidatesTags: ['appointments']
      // }),
      // takeAppointmentAttendance: build.mutation<unknown, TakeAppointmentAttendance>({
      //   query: (arg) => ({
      //     method: 'PUT',
      //     url: `/api/booking-counseling/take-attendance/${arg.appointmentId}/${arg.counselingAppointmentStatus}`,
      //   }),
      //   invalidatesTags: ['appointments']
      // }),
    })
  })

export const {
  useGetCounselingAppointmentRequestsQuery,
  // useDenyAppointmentRequestMutation,
  // useApproveAppointmentRequestOnlineMutation,
  // useApproveAppointmentRequestOfflineMutation,
  // useUpdateAppointmentDetailsMutation,
  // useTakeAppointmentAttendanceMutation
} = requestsApi


export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<AppointmentRequest>>
export type GetCounselingAppointmentApiArg = {

}

// export type GetCounselorApiResponse = ApiResponse<Appointment>
// export type ApproveCounselingAppointmentRequestOnlineArg = {
// 	requestId: number;
// 	meetingDetails: {
// 		meetUrl?: string;
// 	};
// };

// export type ApproveCounselingAppointmentRequestOfflineArg = {
// 	requestId: number;
// 	meetingDetails: {
// 		address?: string;
// 	};
// };
