import { Appointment, AppointmentFeedback, AppointmentReportType, AppointmentRequest, Student, PaginationContent, Profile, Question } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'students',
  'counselingSlots',
  'appointments',
  'qna',
] as const;


export const studentsMangementApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStudentsAcademicManagement: build.query<GetStudentsApiResponse, GetStudentsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/manage/students/academic`,
          params: {
            page
          }
        }),
        providesTags: ['students']
      }),
      getStudentsNonAcademicManagement: build.query<GetStudentsApiResponse, GetStudentsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/manage/students/non-academic`,
          params: {
            page
          }
        }),
        providesTags: ['students']
      }),
      getStudentsManagement: build.query<GetStudentsApiResponse, GetStudentsApiArg>({
        query: ({ type, page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: type === 'ACADEMIC'
            ? `/api/manage/students/academic`
            : `/api/manage/students/non-academic`,
          params: {
            page
          }
        }),
        providesTags: ['students']
      }),
      getStudentManagement: build.query<GetStudentApiResponse, number>({
        query: (studentId) => ({
          url: `/api/manage/students/${studentId}`,
        }),
        providesTags: ['students']
      }),
      updateStudentStatus: build.mutation<void, UpdateStudentStatusArg>({
        query: ({ studentId, status }) => ({
          url: `/api/manage/students/${studentId}/status?status=${status}`,
          method: 'PUT',
        }),
        invalidatesTags: ['students']
      }),
      getCounselingSlots: build.query<GetCounselingSlotsResponse, void>({
        query: () => ({
          url: `/api/manage/students/counselling-slots`,
        }),
        providesTags: ['counselingSlots']
      }),
      updateStudentCounselingSlots: build.mutation<void, UpdateStudentCounselingSlotArg>({
        query: ({ studentId, slotId, dayOfWeek }) => ({
          url: `/api/manage/students/${studentId}/assign-slot?slotId=${slotId}&dayOfWeek=${dayOfWeek}`,
          method: 'PUT',
        }),
        invalidatesTags: ['students', 'counselingSlots']
      }),
      deleteStudentCounselingSlots: build.mutation<void, DeleteStudentCounselingSlotArg >({
        query: ({ studentId, slotId }) => ({
          url: `/api/manage/students/${studentId}/unassign-slot?slotId=${slotId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['students',  'counselingSlots']
      }),
      updateStudentAvailableDateRange: build.mutation<void, UpdateStudentAvailableDateRange>({
        query: ({ studentId, startDate, endDate, }) => ({
          url: `/api/manage/students/${studentId}/available-date-range?startDate=${startDate}&endDate=${endDate}`,
          method: 'PUT',
        }),
        invalidatesTags: ['students']
      }),
      getStudentAppointmentsManagement: build.query<GetStudentAppointmentsApiResponse, GetStudentAppointmentsApiArg>({
        query: ({ studentId }) => ({
          url: `/api/students/appointment/filter/12?/${studentId}`,
        }),
        providesTags: ['students', 'appointments']
      }),
      getAppointmentReportManagement: build.query<AppointmentReportApiResponse, AppointmentReportApiArg>({
        query: ({ appointmentId, studentId }) => ({
          url: `/api/manage/students/report/${appointmentId}/${studentId}`,
        }),
        providesTags: ['students', 'appointments']
      }),
      getStudentAppointmentRequestsManagement: build.query<GetCounselingAppointmentApiResponse, GetCounselorAppointmentRequestsApiArg>({
        query: ({
          dateFrom = '',
          dateTo = '',
          status = '',
          sortBy = 'id',
          sortDirection = 'DESC',
          page = 1,
          size = 10,
          meetingType = undefined,
          counselorId
        }) => ({
          url: `/api/booking-counseling/manage/student/appointment-request/${counselorId}`,
          params: {
            dateFrom,
            dateTo,
            status,
            sortBy,
            sortDirection,
            page,
            meetingType,
            size,
          }
        }),
        providesTags: ['students', 'appointments',]
      }),
      getStudentFeedbacks: build.query<GetStudentFeedbacksApResponse, GetStudentFeedbacksApiArg>({
        query: ({ studentId }) => ({
          url: `/api/manage/students/feedback/filter/${studentId}`,
        }),
        providesTags: ['students', 'appointments',]
      }),
      getStudentCounselingSlots: build.query<GetCounselingSlotsResponse, number>({
        query: (studentId) => ({
          url: `/api/manage/students/${studentId}/counseling-slots`,
        }),
        providesTags: ['counselingSlots'],
      }),
      getStudentQuestionCardsManagement: build.query<GetStudentQuestionCardsManagementApiResponse, GetStudentQuestionCardsManagementApiArg>({
        query: ({
          studentId,
          page,
          from,
          to,
          keyword,
          size
        }) => ({
          url: `/api/question-cards/manage/student/filter/${studentId}`,
          params: {
            page,
            from,
            to,
            keyword,
            size
          }
        }),
        providesTags: ['qna'],
      }),
    })
  })

export const {
  useGetStudentsAcademicManagementQuery,
  useGetStudentsNonAcademicManagementQuery,
  useGetStudentsManagementQuery,
  useGetStudentManagementQuery,
  useUpdateStudentStatusMutation,
  useGetCounselingSlotsQuery,
  useUpdateStudentCounselingSlotsMutation,
  useDeleteStudentCounselingSlotsMutation,
  useUpdateStudentAvailableDateRangeMutation,
  useGetStudentAppointmentsManagementQuery,
  useGetAppointmentReportManagementQuery,
  useGetStudentAppointmentRequestsManagementQuery,
  useGetStudentFeedbacksQuery,
  useGetStudentCounselingSlotsQuery,
  useGetStudentQuestionCardsManagementQuery
} = studentsMangementApi


export type GetStudentsApiResponse = ApiResponse<PaginationContent<ManagementStudent>>
export type GetStudentsApiArg = {
  type?: 'ACADEMIC' | 'NON_ACADEMIC',
  search?: string,
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  ratingFrom?: number,
  ratingTo?: number
}

export type GetStudentApiResponse = ApiResponse<ManagementStudent>


export type ManagementStudent = {
  profile?: Student
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

type UpdateStudentStatusArg = {
  status: 'AVAILABLE' | 'UNAVAILABLE',
  studentId: number,
}

type UpdateStudentCounselingSlotArg = {
  slotId: number,
  studentId: number,
  dayOfWeek: string,
}

type DeleteStudentCounselingSlotArg = {
  slotId: number,
  studentId: number,
}

type UpdateStudentAvailableDateRange = {
  studentId: number,
  startDate: string,
  endDate: string,
}


type GetCounselingSlotsResponse = ApiResponse<CounselingSlot[]>

export type GetStudentAppointmentsApiArg = {
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  studentId: number,
}

export type GetStudentAppointmentsApiResponse = ApiResponse<PaginationContent<Appointment>>

export type AppointmentReportApiArg = {
  studentId: number,
  appointmentId: number,
}
export type AppointmentReportApiResponse = ApiResponse<AppointmentReportType>

export type GetCounselingAppointmentApiResponse = ApiResponse<PaginationContent<AppointmentRequest>>


export type GetStudentFeedbacksApResponse = ApiResponse<PaginationContent<AppointmentFeedbacksApManagement>>

export type AppointmentFeedbacksApManagement = AppointmentFeedback & {
  appointment: Appointment
}


export type GetStudentFeedbacksApiArg = {
  studentId: number
}

export type GetStudentQuestionCardsManagementApiResponse = ApiResponse<PaginationContent<Question>>

export type GetStudentQuestionCardsManagementApiArg = {
  sortBy?: string;
  keyword?: string;
  type?: 'ACADEMIC' | 'NON-ACADEMIC' | '';
  studentCode?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  studentId: number,
  status?: string;
  size?: number;
  from?: string;
  to?: string;
}

export type GetCounselorAppointmentRequestsApiArg = {
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  counselorId: number,
  dateFrom?: string,
  dateTo?: string,
  meetingType?: string;
  status?: string;
  size?: number;
}