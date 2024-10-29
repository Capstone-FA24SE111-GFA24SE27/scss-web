import { Account, AppointmentReport, Counselor, PaginationContent, Report, Student } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'appointments'
] as const;


export const reportApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      createAppointmentReport: build.mutation<void, CreateReportApiArg>({
        query: (arg) => ({
          method: 'POST',
          url: `/api/appointments/report/${arg.appointmentId}`,
          body: arg.report
        }),
        invalidatesTags: ['appointments']
      }),

      getAppointmentReport: build.query<AppointmentReportApiResponse, string>({
        query: (appointmentId) => ({
          url: `/api/appointments/report/${appointmentId}`,
        }),
      }),
    })
  })

export const {
  useCreateAppointmentReportMutation,
  useGetAppointmentReportQuery
} = reportApi

type CreateReportApiArg = {
  appointmentId: string,
  report: Report
}


type AppointmentReportApiResponse = ApiResponse<AppointmentReport>
