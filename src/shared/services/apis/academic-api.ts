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
      getDepartments: build.query<GetDepartmentsApiResponse, void>({
        query: () => ({
          url: `/api/academic/departments`,
          method: 'GET',
        }),
        providesTags: ['departments']
      }),
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

    })
  });

// Export hooks for the queries
export const {
  useGetMajorsByDepartmentQuery,
  useGetSpecializationsByMajorQuery,
  useGetDepartmentsQuery,
} = academicApi;

// Types for API responses
type GetMajorsByDepartmentApiResponse = Major[];

export type Major = {
  id: number;
  name: string;
  code: string;
  departmentId: number;
};

type GetSpecializationsByMajorApiResponse = Specialization[];

export type Specialization = {
  id: number;
  name: string;
  majorId: number;
  code: string;
};

export type Department = {
  id: number;
  name: string;
  code: string;
};

type GetDepartmentsApiResponse = Department[];
