import { Account, PaginationContent, Profile, Student } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = ['support-staffs'] as const;

export const adminStaffApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getSupportStaffsFilterAdmin: build.query<
				GetSupportStaffsFilterApiResponse,
				GetSupportStaffsFilterApiArg
			>({
				query: ({
					search = '',
					size= 10,
					sortBy = 'id',
					page = '1',
					sortDirection = 'ASC',
				}) => ({
					url: `/api/support-staff/filter`,
					params: {
						search,
						size,
						sortBy,
						page,
						sortDirection,
					},
				}),
				providesTags: ['support-staffs'],
			}),
		
		}),
	});

export const {
	useGetSupportStaffsFilterAdminQuery,
	
} = adminStaffApi;

type GetSupportStaffsFilterApiResponse = ApiResponse<PaginationContent<Account>>
type GetSupportStaffsFilterApiArg = {
	search?: string;
	size?: number
	sortBy?: 'fullName' | 'id';
	page?: number;
	sortDirection?: 'ASC' | 'DESC';
}