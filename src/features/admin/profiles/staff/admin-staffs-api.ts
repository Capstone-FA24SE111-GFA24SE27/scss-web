import { PaginationContent, Profile, Student } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = ['support-staffs'] as const;

export const counselorsMangementApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			// getSupportStaffsFilterAdmin: build.query<
			// 	GetSupportStaffsFilterApiResponse,
			// 	GetSupportStaffsFilterApiArg
			// >({
			// 	query: ({
			// 		studentCode = '',
			// 		specializationId = '',
			// 		departmentId = '',
			// 		majorId = '',
			// 		currentTerm = '',
			// 		semesterIdForGPA = '',
			// 		minGPA = '',
			// 		maxGPA = '',
			// 		isIncludeBehavior = false,
			// 		semesterIdForBehavior = '',
			// 		promptForBehavior = '',
			// 		keyword = '',
			// 		sortBy = 'createdDate',
			// 		sortDirection = 'ASC',
			// 		page = '',
			// 		tab = '',
			// 	}) => ({
			// 		url: `/api/SupportStaffs/filter`,
			// 		params: {
			// 			studentCode,
			// 			specializationId,
			// 			departmentId,
			// 			majorId,
			// 			currentTerm,
			// 			semesterIdForGPA,
			// 			minGPA,
			// 			maxGPA,
			// 			isIncludeBehavior,
			// 			semesterIdForBehavior,
			// 			promptForBehavior,
			// 			keyword,
			// 			sortBy,
			// 			sortDirection,
			// 			page,
			// 		},
			// 	}),
			// 	providesTags: ['support-staffs'],
			// }),
		
		}),
	});

export const {
	// useGetSupportStaffsFilterAdminQuery,
	
} = counselorsMangementApi;

