import { ApiResponse, apiService as api } from '@shared/store';
import {
  PaginationContent, Student
} from '@shared/types';

const addTagTypes = ['students'] as const;

export const studentListApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStudentsFilter: build.query<GetStudentsFilterApiResponse, GetStudentsFilterApiArg>({
        query: ({
          studentCode = '',
          specializationId = '',
          departmentId = '',
          majorId = '',
          currentTerm = '',
          semesterIdForGPA = '',
          minGPA = '',
          maxGPA = '',
          isIncludeBehavior = false,
          semesterIdForBehavior = '',
          promptForBehavior = '',
          keyword = '',
          sortBy = 'createdDate',
          sortDirection = 'ASC',
          page = ''
        }) => ({
          url: `/api/students/filter`,
          params: {
            studentCode,
            specializationId,
            departmentId,
            majorId,
            currentTerm,
            semesterIdForGPA,
            minGPA,
            maxGPA,
            isIncludeBehavior,
            semesterIdForBehavior,
            promptForBehavior,
            keyword,
            sortBy,
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
} = studentListApi;

// Define types for the updated API response and arguments
export type GetStudentsFilterApiResponse = PaginationContent<Student>;
export type GetStudentsFilterApiArg = {
  studentCode?: string;
  specializationId?: number | '';
  departmentId?: number | '';
  majorId?: number | '';
  currentTerm?: number;
  semesterIdForGPA?: number | '';
  minGPA?: number | '';
  maxGPA?: number | '';
  isIncludeBehavior?: boolean;
  semesterIdForBehavior?: number | '';
  promptForBehavior?: string;
  keyword?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
};
