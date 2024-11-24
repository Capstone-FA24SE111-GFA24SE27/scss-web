import { Account, Appointment, AppointmentDetails, AppointmentFeedback, PaginationContent, TakeAppointmentAttendance } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

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
        query: ({
          studentCode = '',
          fromDate = '',
          toDate = '',
          status = '',
          sortBy = 'id',
          sortDirection = 'DESC',
          page = 1,
          size = 10 
        }) => ({
          url: `/api/appointments/counselor?${studentCode ? `studentCode=${studentCode}` : ``}`,
          params: {
            fromDate,
            toDate,
            status,
            sortBy,
            sortDirection,
            page,
            size 
          },
        }),
        providesTags: ['appointments']
      }),
      cancelCounselingAppointmentCounselor: build.mutation<void, CancelCounselingAppointmentArg>({
        query: ({ appointmentId, reason }) => ({
          method: 'POST',
          url: `/api/booking-counseling/counselor/cancel/${appointmentId}`,
          body: { reason }
        }),
        invalidatesTags: ['appointments'],
      }),
    })
  });

export const {
  useGetCounselorCounselingAppointmentQuery,
  useCancelCounselingAppointmentCounselorMutation
} = appointmentsApi;

// Updated type to include 'size'
export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<Appointment>>;
export type GetCounselingAppointmentApiArg = {
  studentCode?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
};

export type CancelCounselingAppointmentArg = {
  appointmentId: number;
  reason: string
};

