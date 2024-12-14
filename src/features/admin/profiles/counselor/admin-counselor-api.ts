import { Appointment, AppointmentFeedback, AppointmentReportType, AppointmentRequest, Counselor, PaginationContent, Profile, Student } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'counselors',
  'counselingSlots',
  'appointments',
] as const;


export const counselorsAdminApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselorsAcademicAdmin: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/manage/counselors/academic`,
          params: {
            page
          }
        }),
        providesTags: ['counselors']
      }),
      getCounselorsNonAcademicAdmin: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/manage/counselors/non-academic`,
          params: {
            page
          }
        }),
        providesTags: ['counselors']
      }),
      getCounselorsAdmin: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '', type = 'ACADEMIC' }) => ({
          url: type === 'ACADEMIC'
            ? `/api/manage/counselors/academic`
            : `/api/manage/counselors/non-academic`,
            params: {
              page
            }
        }),
        providesTags: ['counselors']
      }),
      getCounselorAdmin: build.query<GetCounselorApiResponse, number | string>({
        query: (counselorId) => ({
          url: `/api/manage/counselors/${counselorId}`,
        }),
        providesTags: ['counselors']
      }),
      updateCounselorStatus: build.mutation<void, UpdateCounselorStatusArg>({
        query: ({ counselorId, status }) => ({
          url: `/api/manage/counselors/${counselorId}/status?status=${status}`,
          method: 'PUT',
        }),
        invalidatesTags: ['counselors']
      }),
      getCounselingSlotsAdmin: build.query<GetCounselingSlotsResponse, void>({
        query: () => ({
          url: `/api/manage/counselors/counselling-slots`,
        }),
        providesTags: ['counselingSlots']
      }),
      // updateCounselorCounselingSlots: build.mutation<void, UpdateCounselorCounselingSlotArg>({
      //   query: ({ counselorId, slotId }) => ({
      //     url: `/api/manage/counselors/${counselorId}/assign-slot?slotId=${slotId}`,
      //     method: 'PUT',
      //   }),
      //   invalidatesTags: ['counselors']
      // }),
      // deleteCounselorCounselingSlots: build.mutation<void, UpdateCounselorCounselingSlotArg>({
      //   query: ({ counselorId, slotId }) => ({
      //     url: `/api/manage/counselors/${counselorId}/unassign-slot?slotId=${slotId}`,
      //     method: 'DELETE',
      //   }),
      //   invalidatesTags: ['counselors']
      // }),
      // updateCounselorAvailableDateRange: build.mutation<void, UpdateCounselorAvailableDateRange>({
      //   query: ({ counselorId, startDate, endDate, }) => ({
      //     url: `/api/manage/counselors/${counselorId}/available-date-range?startDate=${startDate}&endDate=${endDate}`,
      //     method: 'PUT',
      //   }),
      //   invalidatesTags: ['counselors']
      // }),
      getCounselorAppointmentsAdmin: build.query<GetCounselorAppointmentsApiResponse, GetCounselorAppointmentsApiArg>({
        query: ({ counselorId }) => ({
          url: `/api/manage/counselors/appointment/filter/${counselorId}`,
        }),
        providesTags: ['counselors', 'appointments']
      }),
      getAppointmentReportAdmin: build.query<AppointmentReportApiResponse, AppointmentReportApiArg>({
        query: ({ appointmentId, counselorId }) => ({
          url: `/api/manage/counselors/report/${appointmentId}/${counselorId}`,
        }),
        providesTags: ['counselors', 'appointments']
      }),
      getCounselorAppointmentRequestsAdmin: build.query<GetCounselingAppointmentApiResponse, number>({
        query: (counselorId) => ({
          url: `/api/manage/counselors/appointment-request/${counselorId}`,
        }),
        providesTags: ['counselors', 'appointments',]
      }),
      getCounselorFeedbacksAdmin: build.query<GetCounselorFeedbacksApResponse, GetCounselorFeedbacksApiArg>({
        query: ({ counselorId }) => ({
          url: `/api/manage/counselors/feedback/filter/${counselorId}`,
        }),
        providesTags: ['counselors', 'appointments',]
      }),
      getCounselorCounselingSlotsAdmin: build.query<GetCounselingSlotsResponse, number>({
        query: (counselorId) => ({
          url: `/api/manage/counselors/${counselorId}/counseling-slots`,
        }),
        providesTags: ['counselingSlots'],
      }),
      // putBlockAccount: build.mutation<ApiResponse<string>,number>({
      //   query: (id) => ({
      //     url: `/api/account/${id}/block`,
      //     method: 'PUT'
      //   }),
      //   invalidatesTags: ['counselors']
      // }),
      // putUnblockAccount: build.mutation<ApiResponse<string>,number>({
      //   query: (id) => ({
      //     url: `/api/account/${id}/unblock`,
      //     method: 'PUT'
      //   }),
      //   invalidatesTags: ['counselors']
      // })
    })
  })

export const {
  useGetCounselorsAcademicAdminQuery,
  useGetCounselorsNonAcademicAdminQuery,
  useGetCounselorsAdminQuery,
  useGetCounselorAdminQuery,
  useGetCounselingSlotsAdminQuery,
  useGetCounselorAppointmentsAdminQuery,
  useGetAppointmentReportAdminQuery,
  useGetCounselorAppointmentRequestsAdminQuery,
  useGetCounselorFeedbacksAdminQuery,
  useGetCounselorCounselingSlotsAdminQuery
  // usePutBlockAccountMutation,
  // usePutUnblockAccountMutation
} = counselorsAdminApi


export type GetCounselorsApiResponse = ApiResponse<PaginationContent<ManagementCounselor>>
export type GetCounselorsApiArg = {
  search?: string,
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  ratingFrom?: number,
  ratingTo?: number
  type?: 'ACADEMIC' | 'NON_ACADEMIC'
}

export type GetCounselorApiResponse = ApiResponse<ManagementCounselor>


export type ManagementCounselor = {
  profile?: Counselor
  availableDateRange: AvailableDateRange;
  counselingSlot: CounselingSlot[];
}

type AvailableDateRange = {
  startDate: string;
  endDate: string;
};

export type CounselingSlot = {
  id: number;
  slotCode: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string,
};

type UpdateCounselorStatusArg = {
  status: 'AVAILABLE' | 'UNAVAILABLE',
  counselorId: number,
}

type UpdateCounselorCounselingSlotArg = {
  slotId: number,
  counselorId: number,
}

type UpdateCounselorAvailableDateRange = {
  counselorId: number,
  startDate: string,
  endDate: string,
}


type GetCounselingSlotsResponse = ApiResponse<CounselingSlot[]>

export type GetCounselorAppointmentsApiArg = {
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  counselorId: number,
}

export type GetCounselorAppointmentsApiResponse = ApiResponse<PaginationContent<Appointment>>

export type AppointmentReportApiArg = {
  counselorId: number,
  appointmentId: number,
}
export type AppointmentReportApiResponse = ApiResponse<AppointmentReportType>

export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<AppointmentRequest>>


export type GetCounselorFeedbacksApResponse = ApiResponse<PaginationContent<AppointmentFeedbacksApManagement>>

export type AppointmentFeedbacksApManagement = AppointmentFeedback & {
  appointment: Appointment
}


export type GetCounselorFeedbacksApiArg = {
  counselorId: number
}