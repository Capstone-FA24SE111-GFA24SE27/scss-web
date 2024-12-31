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
      getAllAppointments: build.query<ApiResponse<Appointment[]>, { from?: string; to?: string }>({
        query: ({ from, to }) => ({
          url: '/api/appointments/manage/find-all',
          params: { from, to },
        }),
        providesTags: ['appointments'],
      }),

      getAllAppointmentRequests: build.query<ApiResponse<AppointmentRequest[]>, { from?: string; to?: string }>({
        query: ({ from, to }) => ({
          url: '/api/booking-counseling/manage/appointment-request/find-all',
          params: { from, to },
        }),
        providesTags: ['appointmentRequests'],
      }),

      getAllCounselingDemands: build.query<ApiResponse<CounselingDemand[]>, { from?: string; to?: string }>({
        query: ({ from, to }) => ({
          url: '/api/counseling-demand/manage/find-all',
          params: { from, to },
        }),
        providesTags: ['counselingDemands'],
      }),

      getAllQuestionCards: build.query<ApiResponse<Question[]>, { from?: string; to?: string }>({
        query: ({ from, to }) => ({
          url: '/api/question-cards/manage/find-all',
          params: { from, to },
        }),
        providesTags: ['questionCards'],
      }),
      getAllProblemTagsBySemester: build.query<ApiResponse<{
        problemTagName: string,
        count: number
      }[]>, { semesterName?: string }>({
        query: ({ semesterName }) => ({
          url: '/api/dashboard/problem-tags',
          params: { semesterName },
        }),
      }),
    }),
  });

export const {
  useGetAllAppointmentsQuery,
  useGetAllAppointmentRequestsQuery,
  useGetAllCounselingDemandsQuery,
  useGetAllQuestionCardsQuery,
  useGetAllProblemTagsBySemesterQuery
} = managerOverviewApi;
