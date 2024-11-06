import { ApiResponse, apiService as api } from '@shared/store';

const addTagTypes = [
  'departments',
  'major',
  'specialization',
] as const;

export const academicApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getMajorsByDepartment: build.query<GetMajorsByDepartmentApiResponse, string>({
        query: (departmentId) => ({
          url: `/api/academic/departments/${departmentId}/majors`,
          method: 'GET',
        }),
        providesTags: ['major']
      }),

      getSpecializationsByMajor: build.query<GetSpecializationsByMajorApiResponse, string>({
        query: (majorId) => ({
          url: `/api/academic/majors/${majorId}/specializations`,
          method: 'GET',
        }),
        providesTags: ['specialization']
      }),

      getAllSpecializations: build.query<GetAllSpecializationsApiResponse, void>({
        query: () => ({
          url: `/api/academic/majors/{majorId}/specializations`,
          method: 'GET',
        }),
        providesTags: ['specialization']
      }),
    })
  });

// Export hooks for the queries
export const {
  useGetMajorsByDepartmentQuery,
  useGetSpecializationsByMajorQuery,
  useGetAllSpecializationsQuery,
} = academicApi;

// Types for API responses
type GetMajorsByDepartmentApiResponse = Major[];

export type Major = {
  id: number;
  name: string;
  code: string;
  departmentId: number | null; // assuming departmentId can be null
};

type GetSpecializationsByMajorApiResponse = Specialization[];

export type Specialization = {
  id: number;
  name: string;
  majorId: number | null; // assuming majorId can be null
  code: string;
};

type GetAllSpecializationsApiResponse = Specialization[];
