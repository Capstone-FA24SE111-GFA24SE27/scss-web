import { ApiResponse, apiService as api } from '@shared/store'


const addTagTypes = [
  'topics'
] as const;


export const topicApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getAcademicTopics: build.query<GetAcademicTopicApiResponse, void>({
        query: () => ({
          url: `/api/topics/academic`,
          method: 'GET',
        }),
        providesTags: ['topics']
      }),
      getNonAcademicTopics: build.query<GetNonAcademicTopicApiResponse, void>({
        query: () => ({
          url: `/api/topics/non-academic`,
          method: 'GET',
        }),
        providesTags: ['topics']
      }),
    })
  })

export const {
  useGetAcademicTopicsQuery,
  useGetNonAcademicTopicsQuery
} = topicApi


type GetAcademicTopicApiResponse = ApiResponse<Topic[]>
type GetNonAcademicTopicApiResponse = ApiResponse<Topic[]>

export type Topic = {
  id: number;
  name: string;
  type: string;
}
