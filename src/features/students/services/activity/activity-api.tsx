import { Account, Appointment, AppointmentRequest, Counselor, PaginationContent, Student } from '@shared/types';
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
        query: ({
          fromDate = '',
          toDate = '',
          status = '',
          sortBy = 'id',
          sortDirection = 'DESC',
          page = 1
        }) => ({
          url: `/api/appointments/student`,
          params: {
            fromDate,
            toDate,
            status,
            sortBy,
            sortDirection,
            page,
          },
        }),
        providesTags: ['appointments']
      }),
      getCounselingAppointmentRequests: build.query<GetCounselingAppointmentRequestApiResponse, GetCounselingAppointmentRequestApiArg>({
        query: ({
          dateFrom = '',
          dateTo = '',
          meetingType = '',
          sortBy = 'id',
          sortDirection = 'DESC',
          page = 1,
          status = '',
        }) => ({
          url: `/api/booking-counseling/appointment-request`,
          params: {
            dateFrom,
            dateTo,
            meetingType,
            sortBy,
            sortDirection,
            page,
            status
          },
        }),
        providesTags: ['appointments']
      }),
      sendCouselingAppointmentFeedback: build.mutation<unknown, SendCouselingAppointmentFeedback>({
        query: ({ appointmentId, feedback }) => ({
          method: 'POST',
          url: `/api/booking-counseling/feedback/${appointmentId}`,
          body: feedback
        }),
        invalidatesTags: ['appointments']
      }),
      cancelCounselingAppointment: build.mutation<void, CancelCounselingAppointmentArg>({
        query: ({ appointmentId, reason }) => ({
          method: 'POST',
          url: `/api/booking-counseling/student/cancel/${appointmentId}`,
          body: { reason }
        }),
        invalidatesTags: ['appointments'],
      }),
    })
  })

export const {
  useGetCounselingAppointmentRequestsQuery,
  useSendCouselingAppointmentFeedbackMutation,
  useGetCounselingAppointmentQuery,
  useCancelCounselingAppointmentMutation,
} = activityApi


export type GetCounselingAppointmentRequestApiResponse = ApiResponse<PaginationContent<AppointmentRequest>>;
export type GetCounselingAppointmentRequestApiArg = {
  dateFrom?: string;
  dateTo?: string;
  meetingType?: 'ONLINE' | 'OFFLINE' | '';
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC' | '';
  status: string;
  page?: number;
};

export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<Appointment>>
export type GetCounselingAppointmentApiArg = {
  fromDate?: string;
  toDate?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
}


export type GetCounselorApiResponse = ApiResponse<AppointmentRequest>

export type SendCouselingAppointmentFeedback = {
  appointmentId: number,
  feedback: Feedback
}

export type AppointmentDetails = {
  address: string
  meetUrl: string
}

export type Feedback = {
  comment: string,
  rating: number,
}

export type CancelCounselingAppointmentArg = {
  appointmentId: number;
  reason: string
};

