import { Student, StudentCounselingDocumentInfo, StudentDocument } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'students'
] as const;


export const studentsApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      createStudentDocument: build.mutation<void, CreateStudentCounselingDocumentApiArg>({
        query: (arg) => ({
          url: `/api/students/document/info`,
          method: 'POST',
          body: arg
        }),
        invalidatesTags: ['students']
      }),
      editStudentDocument: build.mutation<void, CreateStudentCounselingDocumentApiArg>({
        query: (arg) => ({
          url: `/api/students/document/info`,
          method: 'PUT',
          body: arg
        }),
        invalidatesTags: ['students']
      }),
      getStudentDocument: build.query<GetStudentDocumentApiResponse, void>({
        query: () => ({
          url: `/api/students/document/info`,
        }),
        providesTags: ['students']
      }),
    })
  })

export const {
  useCreateStudentDocumentMutation,
  useEditStudentDocumentMutation,
  useGetStudentDocumentQuery,
} = studentsApi


export type CreateStudentCounselingDocumentApiArg = StudentCounselingDocumentInfo

export type GetStudentDocumentApiResponse = ApiResponse<StudentDocument>

