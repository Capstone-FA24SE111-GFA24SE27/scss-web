
import { PaginationContent, Student } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = ['students'] as const;

export const staffRecommendedStudentsApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getRecommendedStudentsStaff: build.query<
				GetStudentsFilterApiResponse,
				GetStudentsFilterApiArg
			>({
				query: ({
					specializationId,
					departmentId,
					majorId,
					semesterIdForBehavior,
					promptForBehavior,
					keyword,
					sortBy = 'createdDate',
					sortDirection = 'ASC',
					page,
				}) => ({
					url: `/api/students/recommendation/filter`,
					params: {
						specializationId,
						departmentId,
						majorId,
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
	useGetRecommendedStudentsStaffQuery
} = staffRecommendedStudentsApi;

export type GetStudentsFilterApiResponse = PaginationContent<Student>;
export type GetStudentsFilterApiArg = {
	specializationId?: number | '';
	departmentId?: number | '';
	majorId?: number | '';
	semesterIdForBehavior?: number | '';
	promptForBehavior?: string;
	keyword?: string;
	sortBy?: string;
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
};