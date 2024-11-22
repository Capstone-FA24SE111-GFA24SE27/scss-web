import { CounselingDemand } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

const addTagTypes = [
  'demand'
] as const;

export const demandApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getDemandById: build.query<GetDemandByIdApiResponse, string>({
        query: (demandId) => ({
          url: `/api/counseling-demand/${demandId}`,
          method: 'GET',
        }),
        providesTags: ['demand']
      }),
    })
  });

export const {
  useGetDemandByIdQuery
} = demandApi;

type GetDemandByIdApiResponse = CounselingDemand