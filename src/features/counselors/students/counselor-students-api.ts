import { ApiResponse, apiService as api } from '@shared/store';
import {
  HolidayScheduleType, PaginationContent, Student
} from '@shared/types';

const addTagTypes = ['students'] as const;

export const counselorStudentsApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStudentsFilter: build.query<GetStudentsFilterApiResponse, GetStudentsFilterApiArg>({
        query: ({
          studentCode = '',
          specializationId = '',
          keyword = '',
          sortBy = 'createdDate',
          sortDirection = 'ASC',
          page = ''
        }) => ({
          url: `/api/students/filter`,
          params: {
            studentCode,
            specializationId,
            sortBy,
            keyword,
            sortDirection,
            page,
          },
        }),
        providesTags: ['students'],
      }),
    }),
  });

export const {
  useGetStudentsFilterQuery,
} = counselorStudentsApi;

// Define types for the new API response and arguments
export type GetStudentsFilterApiResponse = PaginationContent<Student>;
export type GetStudentsFilterApiArg = {
  studentCode?: string;
  specializationId?: number;
  sortBy?: string;
  keyword?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
};
