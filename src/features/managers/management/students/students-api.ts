import { Appointment, AppointmentFeedback, AppointmentReportType, AppointmentRequest, Student, PaginationContent, Profile } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'students',
  'counselingSlots',
  'appointments',
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
          url: `/api/manage/students/appointment/filter/${studentId}`,
        }),
        providesTags: ['students', 'appointments']
      }),
      getAppointmentReportManagement: build.query<AppointmentReportApiResponse, AppointmentReportApiArg>({
        query: ({ appointmentId, studentId }) => ({
          url: `/api/manage/students/report/${appointmentId}/${studentId}`,
        }),
        providesTags: ['students', 'appointments']
      }),
      getStudentAppointmentRequestsManagement: build.query<GetCounselingAppointmentApiResponse, number>({
        query: (studentId) => ({
          url: `/api/manage/students/appointment-request/${studentId}`,
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
  useGetStudentCounselingSlotsQuery, // Add this line for the new hook
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