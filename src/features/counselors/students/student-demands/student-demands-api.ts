import { ApiResponse, apiService as api } from '@shared/store';
import {
  CounselingDemand,
  PaginationContent,
  Student
} from '@shared/types';

const addTagTypes = ['students', 'counselingDemand', 'appointments'] as const;

export const studentDemandsApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselingDemandCounselorsFilter: build.query<GetCounselingDemandFilterApiResponse, GetCounselingDemandFilterApiArg>({
        query: ({
          keyword = '',
          status = 'PROCESSING',
          sortBy = 'createdDate',
          sortDirection = 'DESC',
          page = 1,
        }) => ({
          url: `/api/counseling-demand/counselor/filter`,
          params: {
            keyword,
            status,
            sortBy,
            sortDirection,
            page,
          },
        }),
        providesTags: ['counselingDemand'],
      }),
      createAppointmentByDemand: build.mutation<ApiResponse<CounselingDemand>, CreateAppointmentByDemandArg>({
        query: ({ demandId, body }) => ({
          url: `/api/appointments/demand/${demandId}/create`,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['appointments', 'counselingDemand'],
      }),
      getCounselingDemandById: build.query<GetCounselingDemandByIdApiResponse, string>({
        query: (id) => ({
          url: `/api/counseling-demand/${id}`,
        }),
        providesTags: ['counselingDemand'],
      }),
      solveCounselingDemand: build.mutation<ApiResponse<CounselingDemand>, SolveCounselingDemandArg>({
        query: ({ counselingDemandId, summarizeNote }) => ({
          url: `/api/counseling-demand/${counselingDemandId}/solve`,
          method: 'PUT',
          body: {
            summarizeNote,
          },
        }),
        invalidatesTags: ['counselingDemand'],
      }),
    }),
  });

export const {
  useGetCounselingDemandCounselorsFilterQuery,
  useCreateAppointmentByDemandMutation,
  useGetCounselingDemandByIdQuery,
  useSolveCounselingDemandMutation,
} = studentDemandsApi;

// Define types for the new API response and arguments
export type GetStudentsFilterApiResponse = PaginationContent<Student>;
export type GetStudentsFilterApiArg = {
  studentCode?: string;
  specializationId?: number;
  sortBy?: string;
  keyword?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
};

export type GetCounselingDemandFilterApiResponse = ApiResponse<PaginationContent<CounselingDemand>>; 
export type GetCounselingDemandFilterApiArg = {
  keyword?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
};

// Define types for the new mutation and query
export type CreateAppointmentByDemandArg = {
  demandId: string;
  body: AppointmentRequestBody;
};

export type AppointmentRequestBody = {
  slotCode: string;
  address?: string;
  meetURL?: string;
  date: string;
  isOnline: boolean;
  reason: string;
};

export type GetCounselingDemandByIdApiResponse = CounselingDemand;

export type SolveCounselingDemandArg = {
  counselingDemandId: string;
  summarizeNote: string;
};
