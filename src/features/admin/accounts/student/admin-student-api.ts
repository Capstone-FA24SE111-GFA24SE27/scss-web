import {
	
	PaginationContent,
	Profile,
	Student,
} from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = [
	'students'
] as const;

export const counselorsMangementApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getStudentsFilterAdmin: build.query<
				GetStudentsFilterApiResponse,
				GetStudentsFilterApiArg
			>({
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
					page = '',
					tab = '',
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

export const {useGetStudentsFilterAdminQuery} = counselorsMangementApi;

type GetStudentsFilterApiResponse = PaginationContent<Student>;
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
	tab: string;
};
