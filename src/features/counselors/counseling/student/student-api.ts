import { ApiResponse, apiService as api } from '@shared/store';
import { Counselor, Student } from '@shared/types';


export const addTagTypes = [
  'students'
] as const;


export const reportApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({

      getStudent: build.query<StudentApiResponse, string>({
        query: (studentId) => ({
          url: `/api/students/${studentId}`,
        }),
        providesTags: ['students']
      }),
    })
  })

export const {
  useGetStudentQuery
} = reportApi

type StudentApiResponse = ApiResponse<Student>
