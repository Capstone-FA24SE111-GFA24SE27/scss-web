import { ApiResponse, apiService as api } from '@shared/store';
import { Appointment, Counselor, PaginationContent, Student, StudentDocument, Subject } from '@shared/types';

export const addTagTypes = [
  'students'
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
    })
  })

export const {
  useGetStudentViewQuery,
  useGetStudentDocumentViewQuery,
  useGetStudentStudyViewQuery,
  useGetStudentAppointmentsQuery
} = studentViewApi

type StudentAppointmentApiResponse = ApiResponse<PaginationContent<Appointment>>; // Adjust according to your API response type

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