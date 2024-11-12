import { Counselor, Profile } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

const addTagTypes = [
  'profile'
] as const;

export const profileApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getProfile: build.query<GetProfileApiResponse, void>({
        query: () => ({
          url: '/api/profile',
          method: 'GET',
        }),
        providesTags: ['profile'],
      }),
      getCounselorProfile: build.query<GetCounselorProfileApiResponse, void>({
        query: () => ({
          url: '/api/profile',
          method: 'GET',
        }),
        providesTags: ['profile'],
      }),
    })
  });

export const {
  useGetProfileQuery,
  useGetCounselorProfileQuery
} = profileApi;

type GetProfileApiResponse = ApiResponse<Profile>;
type GetCounselorProfileApiResponse = ApiResponse<Counselor>;

