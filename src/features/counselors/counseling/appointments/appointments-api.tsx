import { Account, Appointment, AppointmentDetails, AppointmentFeedback, PaginationContent, TakeAppointmentAttendance } from '@shared/types';
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
      getCounselorCounselingAppointment: build.query<GetCounselingAppointmentApiResponse, GetCounselingAppointmentApiArg>({
        query: ({ }) => ({
          url: `/api/appointments/counselor`,
        }),
        providesTags: ['appointments']
      }),
    })
  })

export const {
  useGetCounselorCounselingAppointmentQuery,
} = appointmentsApi


export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<Appointment>>
export type GetCounselingAppointmentApiArg = {

}

// export type GetCounselorApiResponse = ApiResponse<Appointment>



// export type ApproveCounselingAppointmentRequestOnlineArg = {
//   requestId: number,
//   meetingDetails: {
//     meetUrl?: string,
//   }
// }

// export type ApproveCounselingAppointmentRequestOfflineArg = {
//   requestId: number,
//   meetingDetails: {
//     address?: string,
//   }
// }

// export type UpdateAppointmentDetailsArg = {
//   requestId: number,
//   meetingDetails: Partial<AppointmentDetails>
// }

