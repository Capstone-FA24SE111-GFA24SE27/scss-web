import { ApiResponse, apiService as api } from '@shared/store';
import { Appointment, Counselor, PaginationContent, Student, StudentDocument, Subject } from '@shared/types';

export const addTagTypes = [
  'students', 'appointments', 'problemTags'
] as const;

export const studentDetailApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStudentDetail: build.query<StudentApiResponse, string>({
        query: (id) => ({
          url: `/api/students/${id}`,
        }),
        providesTags: ['students']
      }),
      getStudentDocumentDetail: build.query<StudentDocumentApiResponse, string>({
        query: (id) => ({
          url: `/api/students/document/${id}`,
        }),
        providesTags: ['students']
      }),
      getStudentStudyDetail: build.query<StudentStudyApiResponse, string>({
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
      getStudentProblemTagDetails: build.query<GetStudentProblemTagDetailsApiResponse, GetStudentProblemTagDetailsApiArg>({
        query: ({ studentId, semesterName }) => ({
          url: `/api/students/${studentId}/problem-tag/detail/semester/${semesterName}`,
          method: 'GET',
        }),
        providesTags: ['problemTags'],
      }),
      // getStudentBehaviorAssessment: build.query<GetStudentBehaviorAssessmentApiResponse, GetStudentBehaviorAssessmentApiArg>({
      //   query: ({ studentId, semesterName }) => ({
      //     url: `/api/students/${studentId}/behavior/general-assessment/semester/${semesterName}`,
      //     method: 'GET',
      //   }),
      //   providesTags: ['students']
      // }),
      getStudentBehaviorAssessment: build.mutation<GetStudentBehaviorAssessmentApiResponse, GetStudentBehaviorAssessmentApiArg>({
        query: ({ studentId, semesterName }) => ({
          url: `/api/students/${studentId}/behavior/general-assessment/semester/${semesterName}`,
          method: 'GET',
        }),
      }),
      getStudentMarkReport: build.query<GetStudentMarkReportApiResponse, GetStudentMarkReportApiArg>({
        query: ({ studentId, semesterName }) => ({
          url: `/api/students/mark-report/${studentId}/semester/${semesterName}`,
          method: 'GET',
        }),
        providesTags: ['students'],
      }),
    })
  });

export const {
  useGetStudentDetailQuery,
  useGetStudentDocumentDetailQuery,
  useGetStudentStudyDetailQuery,
  useGetStudentAppointmentsQuery,
  useCreateAppointmentMutation,
  useGetStudentByCodeQuery,
  useGetStudentSemesterDetailsQuery,
  useGetStudentProblemTagDetailsQuery,
  // useGetStudentBehaviorAssessmentQuery,
  useGetStudentBehaviorAssessmentMutation,
  useGetStudentMarkReportQuery
} = studentDetailApi;

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

type GetStudentSemesterDetailsApiResponse = ApiResponse<StudentSemesterDetail[]>;

// New API for problem tag details
export type GetStudentProblemTagDetailsApiArg = {
  studentId: string;
  semesterName: string;
};

export type GetStudentProblemTagDetailsApiResponse = ApiResponse<StudentProblemTagDetails>;

export type StudentProblemTagDetails = {
  [subject: string]: {
    isExcluded: ProblemTag[];
    isNotExcluded: ProblemTag[];
  };
};

export type ProblemTag = {
  id: number | null;
  studentCode: string | null;
  source: string;
  problemTagName: string;
  number: number;
  semesterName: string | null;
  excluded: boolean;
  contained: boolean;
};

export type GetStudentBehaviorAssessmentApiArg = {
  studentId: string;
  semesterName: string;
};

export type GetStudentBehaviorAssessmentApiResponse = StudentBehaviorAssessment;

export type StudentBehaviorAssessment = {
  message: string,
  status: number,
};

export type GetStudentMarkReportApiArg = {
  studentId: string;
  semesterName: string;
};

export type GetStudentMarkReportApiResponse = ApiResponse<StudentMarkReport[]>;

export type StudentMarkReport = {
  id: number;
  startDate: string;
  totalSlot: number;
  studentCode: string;
  subjectName: string;
  semesterName: string;
  grade: number | null;
  detais: AttendanceDetail[] | null;
};