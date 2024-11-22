import { Appointment, AppointmentFeedback, AppointmentReportType, AppointmentRequest, CounselingSlot, Counselor, PaginationContent, Profile, Question, Student } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'counselors',
  'counselingSlots',
  'appointments',
  'qna'
] as const;


export const counselorsMangementApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselorsAcademicManagement: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/manage/counselors/academic`,
          params: {
            page
          }
        }),
        providesTags: ['counselors']
      }),
      getCounselorsNonAcademicManagement: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/manage/counselors/non-academic`,
          params: {
            page
          }
        }),
        providesTags: ['counselors']
      }),
      getCounselorsManagement: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ type, page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: type === 'ACADEMIC'
            ? `/api/manage/counselors/academic`
            : `/api/manage/counselors/non-academic`,
          params: {
            page
          }
        }),
        providesTags: ['counselors']
      }),
      getCounselorManagement: build.query<GetCounselorApiResponse, number>({
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
      getCounselingSlots: build.query<GetCounselingSlotsResponse, void>({
        query: () => ({
          url: `/api/manage/counselors/counselling-slots`,
        }),
        providesTags: ['counselingSlots']
      }),
      updateCounselorCounselingSlots: build.mutation<void, UpdateCounselorCounselingSlotArg>({
        query: ({ counselorId, slotId, dayOfWeek }) => ({
          url: `/api/manage/counselors/${counselorId}/assign-slot?slotId=${slotId}&dayOfWeek=${dayOfWeek}`,
          method: 'PUT',
        }),
        invalidatesTags: ['counselors', 'counselingSlots']
      }),
      deleteCounselorCounselingSlots: build.mutation<void, DeleteCounselorCounselingSlotArg>({
        query: ({ counselorId, slotId }) => ({
          url: `/api/manage/counselors/${counselorId}/unassign-slot?slotId=${slotId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['counselors', 'counselingSlots']
      }),
      updateCounselorAvailableDateRange: build.mutation<void, UpdateCounselorAvailableDateRange>({
        query: ({ counselorId, startDate, endDate, }) => ({
          url: `/api/manage/counselors/${counselorId}/available-date-range?startDate=${startDate}&endDate=${endDate}`,
          method: 'PUT',
        }),
        invalidatesTags: ['counselors']
      }),
      getCounselorAppointmentsManagement: build.query<GetCounselorAppointmentsApiResponse, GetCounselorAppointmentsApiArg>({
        query: ({ counselorId }) => ({
          url: `/api/manage/counselors/appointment/filter/${counselorId}`,
        }),
        providesTags: ['counselors', 'appointments']
      }),
      getAppointmentReportManagement: build.query<AppointmentReportApiResponse, AppointmentReportApiArg>({
        query: ({ appointmentId, counselorId }) => ({
          url: `/api/manage/counselors/report/${appointmentId}/${counselorId}`,
        }),
        providesTags: ['counselors', 'appointments']
      }),
      getCounselorAppointmentRequestsManagement: build.query<GetCounselingAppointmentApiResponse, number>({
        query: (counselorId) => ({
          url: `/api/manage/counselors/appointment-request/${counselorId}`,
        }),
        providesTags: ['counselors', 'appointments',]
      }),
      getCounselorFeedbacks: build.query<GetCounselorFeedbacksApResponse, GetCounselorFeedbacksApiArg>({
        query: ({ counselorId }) => ({
          url: `/api/manage/counselors/feedback/filter/${counselorId}`,
        }),
        providesTags: ['counselors', 'appointments',]
      }),
      getCounselorCounselingSlots: build.query<GetCounselingSlotsResponse, number>({
        query: (counselorId) => ({
          url: `/api/manage/counselors/${counselorId}/counseling-slots`,
        }),
        providesTags: ['counselingSlots'],
      }),
      getCounselorQuestionCardsManagement: build.query<GetCounselorQuestionCardsManagementApiArg, GetCounselorQuestionCardsManagementApiResponse>({
        query: ({
          counselorId,
          page
        }) => ({
          url: `/api/question-cards/manage/counselor/filter/${counselorId}`,
        }),
        providesTags: ['counselors', 'qna'],
      }),
      getCounselorScheduleAppointments: build.query<
        GetCounselorScheduleAppointmentsApiResponse,
        GetCounselorScheduleAppointmentsApiArg
      >({
        query: ({ 
          id,
          fromDate,
          toDate
         }) => ({
          url: `/api/manage/counselors/schedule/appointment/counselor/${id}`,
          params: {fromDate, toDate },
        }),
        providesTags: ['counselors', 'appointments'],
      }),
    })
  })

export const {
  useGetCounselorsAcademicManagementQuery,
  useGetCounselorsNonAcademicManagementQuery,
  useGetCounselorsManagementQuery,
  useGetCounselorManagementQuery,
  useUpdateCounselorStatusMutation,
  useGetCounselingSlotsQuery,
  useUpdateCounselorCounselingSlotsMutation,
  useDeleteCounselorCounselingSlotsMutation,
  useUpdateCounselorAvailableDateRangeMutation,
  useGetCounselorAppointmentsManagementQuery,
  useGetAppointmentReportManagementQuery,
  useGetCounselorAppointmentRequestsManagementQuery,
  useGetCounselorFeedbacksQuery,
  useGetCounselorCounselingSlotsQuery,
  useGetCounselorQuestionCardsManagementQuery,
  useGetCounselorScheduleAppointmentsQuery
} = counselorsMangementApi


export type GetCounselorsApiResponse = ApiResponse<PaginationContent<ManagementCounselor>>
export type GetCounselorsApiArg = {
  type?: 'ACADEMIC' | 'NON_ACADEMIC',
  search?: string,
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  ratingFrom?: number,
  ratingTo?: number
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


type UpdateCounselorStatusArg = {
  status: 'AVAILABLE' | 'UNAVAILABLE',
  counselorId: number,
}

type UpdateCounselorCounselingSlotArg = {
  slotId: number,
  counselorId: number,
  dayOfWeek: string,
}

type DeleteCounselorCounselingSlotArg = {
  slotId: number,
  counselorId: number,
}

type UpdateCounselorAvailableDateRange = {
  counselorId: number,
  startDate: string,
  endDate: string,
}


export type GetCounselingSlotsResponse = ApiResponse<CounselingSlot[]>

export type GetCounselorAppointmentsApiArg = {
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  counselorId: number,
}

export type GetCounselorQuestionCardsManagementApiArg = ApiResponse<PaginationContent<Question>>

export type GetCounselorQuestionCardsManagementApiResponse = {
  sortBy?: string;
  keyword?: string;
  type?: 'ACADEMIC' | 'NON-ACADEMIC' | '';
  studentCode?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  counselorId: number
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

export type GetCounselorScheduleAppointmentsApiResponse = ApiResponse<Appointment>
export type GetCounselorScheduleAppointmentsApiArg = {
  id: number,
  fromDate : string,
  toDate: string,
}