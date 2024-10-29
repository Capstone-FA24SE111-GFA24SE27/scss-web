import { ApiResponse, apiService as api } from '@shared/store';
import { Counselor, Student, StudentDocument } from '@shared/types';


export const addTagTypes = [
  'students'
] as const;


export const reportApi = api
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
    })
  })

export const {
  useGetStudentViewQuery,
  useGetStudentDocumentViewQuery,
} = reportApi

type StudentApiResponse = ApiResponse<Student>
type StudentDocumentApiResponse = ApiResponse<StudentDocument>
