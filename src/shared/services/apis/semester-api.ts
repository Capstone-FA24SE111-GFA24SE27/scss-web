import { ApiResponse, apiService as api } from '@shared/store'

const addTagTypes = [
  'semester'
] as const;

export const semesterApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getSemesters: build.query<GetSemesterApiResponse, void>({
        query: () => ({
          url: `/api/academic/semester`,
          method: 'GET',
        }),
        providesTags: ['semester']
      }),
    })
  })

export const {
  useGetSemestersQuery
} = semesterApi

type GetSemesterApiResponse = Semester[]

export type Semester = {
  id: number;
  name: string;
}
