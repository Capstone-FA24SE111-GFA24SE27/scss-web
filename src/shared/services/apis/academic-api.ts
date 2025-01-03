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
      getMajorsByDepartment: build.query<GetMajorsByDepartmentApiResponse, string | number>({
        query: (departmentId) => ({
          url: `/api/academic/departments/${departmentId}/majors`,
          method: 'GET',
        }),
        providesTags: ['major']
      }),

      getSpecializationsByMajor: build.query<GetSpecializationsByMajorApiResponse, string | number>({
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

type GetSpecializationsByMajorApiResponse = Specialization[];

type GetDepartmentsApiResponse = Department[];


export type Major = {
  id: number;
  name: string;
  code: string;
  departmentId: number;
};


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

