import { AppointmentRequest, PaginationContent } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = [
  'appointments'
] as const;

export const requestsApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselorAppointmentRequests: build.query<GetCounselingAppointmentRequestApiResponse, GetCounselingAppointmentRequestApiArg>({
        query: ({
          dateFrom = '',
          dateTo = '',
          meetingType = '',
          sortBy = 'id',
          status = '',
          sortDirection = 'DESC',
          page = 1,
          size = 10
        }) => ({
          url: `/api/booking-counseling/appointment-request`,
          params: {
            dateFrom,
            dateTo,
            meetingType,
            sortBy,
            sortDirection,
            status,
            page,
            size
          },
        }),
        providesTags: ['appointments']
      }),
    })
  });

export const {
  useGetCounselorAppointmentRequestsQuery,
} = requestsApi;

export type GetCounselingAppointmentRequestApiResponse = ApiResponse<PaginationContent<AppointmentRequest>>;
export type GetCounselingAppointmentRequestApiArg = {
  dateFrom?: string;
  dateTo?: string;
  // meetingType?: 'ONLINE' | 'OFFLINE' | '';
  meetingType?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC' | '';
  page?: number;
  status?: string;
  size?: number;
};