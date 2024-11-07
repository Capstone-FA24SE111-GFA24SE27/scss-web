import {
	Account,
	CounselingDemand,
	Counselor,
	PaginationContent,
	Question,
	Student,
	User,
} from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = ['demands', 'counselor'] as const;

export const recommendedStudentsApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			
		}),
	});

export const {
	
} = recommendedStudentsApi;
