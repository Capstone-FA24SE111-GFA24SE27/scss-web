import {
  Appointment,
  AppointmentRequest,
  CounselingDemand,
  Question,
} from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = [
  'appointments', 
  'appointmentRequests',
  'counselingDemands',
  'questionCards',
] as const;

export const managerOverviewApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      // API 1: Get appointments (no pagination)
      getAllAppointments: build.query<ApiResponse<Appointment[]>, { from?: string; to?: string }>({
        query: ({ from, to }) => ({
          url: '/api/appointments/manage/find-all',
          params: { from, to },
        }),
        providesTags: ['appointments'],
      }),

      // API 2: Get appointment requests (no pagination)
      getAllAppointmentRequests: build.query<ApiResponse<AppointmentRequest[]>, { from?: string; to?: string }>({
        query: ({ from, to }) => ({
          url: '/api/booking-counseling/manage/appointment-request/find-all',
          params: { from, to },
        }),
        providesTags: ['appointmentRequests'],
      }),

      // API 3: Get counseling demands (no pagination)
      getAllCounselingDemands: build.query<ApiResponse<CounselingDemand[]>, { from?: string; to?: string }>({
        query: ({ from, to }) => ({
          url: '/api/counseling-demand/manage/find-all',
          params: { from, to },
        }),
        providesTags: ['counselingDemands'],
      }),

      // API 4: Get question cards (no pagination)
      getAllQuestionCards: build.query<ApiResponse<Question[]>, { from?: string; to?: string }>({
        query: ({ from, to }) => ({
          url: '/api/question-cards/manage/find-all',
          params: { from, to },
        }),
        providesTags: ['questionCards'],
      }),
    }),
  });

export const {
  useGetAllAppointmentsQuery,
  useGetAllAppointmentRequestsQuery,
  useGetAllCounselingDemandsQuery,
  useGetAllQuestionCardsQuery,
} = managerOverviewApi;
