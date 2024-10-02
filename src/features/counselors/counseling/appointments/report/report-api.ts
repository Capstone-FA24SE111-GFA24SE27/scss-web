import { Account, Counselor, PaginationContent, Student } from '@shared/types';
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


type AppointmentReport = {
  id: number,
  student: Student,
  counselor: Counselor,
  appointment: Appointment
} & Report



type Report = {
  consultationGoal?: {
    specificGoal?: string;
    reason?: string;
  };
  consultationContent?: {
    summaryOfDiscussion?: string;
    mainIssues?: string;
    studentEmotions?: string;
    studentReactions?: string;
  };
  consultationConclusion?: {
    counselorConclusion?: string;
    followUpNeeded?: boolean;
    followUpNotes?: string;
  };
  intervention?: {
    type?: string;
    description?: string;
  };
};


type Appointment = {
  id: number,
  requireDate: string,
  startDateTime: string,
  endDateTime: string,
  status: string,
  meetingType: 'ONLINE' | 'OFFLINE',
  reason: string,
  meetUrl?: string,
  address?: string,
}
