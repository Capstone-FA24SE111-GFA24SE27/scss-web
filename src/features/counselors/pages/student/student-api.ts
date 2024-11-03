import { ApiResponse, apiService as api } from '@shared/store';
import { Appointment, Counselor, PaginationContent, Student, StudentDocument, Subject } from '@shared/types';

export const addTagTypes = [
  'students', 'appointments'
] as const;

export const studentViewApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStudentView: build.query<StudentApiResponse, string>({
        query: (id) => ({
          url: `/api/students/${id}`,
        }),
        providesTags: ['students']
      }),
      getStudentDocumentView: build.query<StudentDocumentApiResponse, string>({
        query: (id) => ({
          url: `/api/students/document/${id}`,
        }),
        providesTags: ['students']
      }),
      getStudentStudyView: build.query<StudentStudyApiResponse, string>({
        query: (studentId) => ({
          url: `/api/students/study/${studentId}`,
        }),
        providesTags: ['students']
      }),
      getStudentAppointments: build.query<StudentAppointmentApiResponse, StudentAppointmentApiArg>({
        query: ({
          id = '',
          fromDate = '',
          toDate = '',
          sortBy = 'id',
          sortDirection = '',
          page = ''
        }) => ({
          url: `/api/students/appointment/filter/${id}`,
          params: {
            fromDate,
            toDate,
            sortBy,
            sortDirection,
            page,
          },
        }),
        providesTags: ['students']
      }),
      createAppointment: build.mutation<ApiResponse<Appointment>, { studentId: string, body: AppointmentRequestBody }>({
        query: ({ studentId, body }) => ({
          url: `/api/appointments/create/${studentId}`,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['students', 'appointments']
      }),
      getStudentByCode: build.query<StudentApiResponse, string>({
        query: (code) => ({
          url: `/api/students/code/${code}`,
        }),
        providesTags: ['students']
      })
    })
  });

export const {
  useGetStudentViewQuery,
  useGetStudentDocumentViewQuery,
  useGetStudentStudyViewQuery,
  useGetStudentAppointmentsQuery,
  useCreateAppointmentMutation,
  useGetStudentByCodeQuery 
} = studentViewApi;

type StudentAppointmentApiResponse = ApiResponse<PaginationContent<Appointment>>;
type StudentApiResponse = ApiResponse<Student>;
type StudentDocumentApiResponse = ApiResponse<StudentDocument>;
type StudentStudyApiResponse = ApiResponse<Subject[]>;
type StudentAppointmentApiArg = {
  id?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number | string;
};

type AppointmentRequestBody = {
  slotCode: string;
  address?: string;
  meetURL?: string;
  date: string;
  isOnline: boolean;
  reason: string;
};
