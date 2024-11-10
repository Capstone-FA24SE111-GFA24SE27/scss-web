import { Expertise } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';


const addTagTypes = [
  'expertises',
] as const;


export const nonAcademicgApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselorExpertises: build.query<GetCounselorExpertisesApiResponse, void>({
        query: () => ({
          url: `/api/counselors/expertise`,
        }),
        providesTags: ['expertises']
      }),
    })
  })

export const {
  useGetCounselorExpertisesQuery,
} = nonAcademicgApi


export type GetCounselorExpertisesApiResponse = ApiResponse<Expertise[]>





