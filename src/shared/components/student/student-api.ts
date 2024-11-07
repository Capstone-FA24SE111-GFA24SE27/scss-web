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
      }),
      getStudentSemesterDetails: build.query<GetStudentSemesterDetailsApiResponse, GetStudentSemesterDetailsApiArg>({
        query: ({ studentId, semesterName }) => ({
          url: `/api/students/${studentId}/semester/${semesterName}`,
          method: 'GET',
        }),
        providesTags: ['students']
      }),
      getStudentsList: build.query<GetStudentsListApiResponse, GetStudentsListApiArg>({
        query: ({
          studentCode = '',
          specializationId = '',
          keyword = '',
          sortBy = 'createdDate',
          sortDirection = 'ASC',
          page = ''
        }) => ({
          url: `/api/students/filter`,
          params: {
            studentCode,
            specializationId,
            sortBy,
            keyword,
            sortDirection,
            page,
          },
        }),
        providesTags: ['students'],
      }),
    })
  });

export const {
  useGetStudentViewQuery,
  useGetStudentDocumentViewQuery,
  useGetStudentStudyViewQuery,
  useGetStudentAppointmentsQuery,
  useCreateAppointmentMutation,
  useGetStudentByCodeQuery,
  useGetStudentSemesterDetailsQuery,
  useGetStudentsListQuery
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

export type GetStudentsListApiResponse = PaginationContent<Student>;
export type GetStudentsListApiArg = {
	studentCode?: string;
	specializationId?: number;
	sortBy?: string;
	keyword?: string;
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
};

type AppointmentRequestBody = {
  slotCode: string;
  address?: string;
  meetURL?: string;
  date: string;
  isOnline: boolean;
  reason: string;
};

export type StudentSemesterDetail = {
  id: number;
  startDate: string;
  totalSlot: number;
  studentCode: string;
  subjectName: string;
  semesterName: string;
  detais: AttendanceDetail[];
}

export type AttendanceDetail = {
  date: string;
  slot: string;
  room: string;
  lecturer: string;
  groupName: string;
  status: string;
  lecturerComment: string | null;
}

// Parameters for API query
export type GetStudentSemesterDetailsApiArg = {
  studentId: string;
  semesterName: string;
}

type GetStudentSemesterDetailsApiResponse = ApiResponse<StudentSemesterDetail[]>
