import { Account, Role } from '@/shared/types';
import { apiService, ApiResponse } from '@shared/store';

const addTagTypes = [
	'a-counselors',
	'na-counselors',
	'a-counselor',
	'na-counselor',
] as const;

export const adminApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAcademicCounselorsAccounts: build.query<
				getAcademicCounselorsAccountsResponse,
				getAccountsArgs
			>({
				query: (args) => ({
					url: `/api/account?SortDirection=${args.sortDirection}&sortBy=${args.sortBy}&page=${args.page}&role=${args.role}`,
				}),
				providesTags: ['a-counselors'],
			}),
			getOneAcademicCounselorAccount: build.query<
				getOneAcademicCounselorAccountResponse,
				getOneAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/${args.id}`,
				}),
				providesTags: ['a-counselor'],
			}),
		}),
	});

export const {} = adminApi;

type getAcademicCounselorsAccountsResponse = ApiResponse<Account[]>;
type getAccountsArgs = {
	search?: string;
	status?: 'ACTIVE' | 'INACTIVE';
	sortBy?: 'fullName' | 'id';
	page?: number;
	sortDirection: 'ASC' | 'DESC';
	role: Role;
};

type getOneAcademicCounselorAccountResponse = ApiResponse<Account>;
type getOneAccountArgs = {
	id: number;
};
