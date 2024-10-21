import { Account } from '@/shared/types';
import { apiService, ApiResponse } from '@shared/store';

const addTagTypes = ['a-counselors', 'na-counselors', 'a-counselor', 'na-counselor'] as const;

export const adminApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAcademicCounselorsAccounts: build.query<
				getAcademicCounselorsAccountsResponse,
				getAcademicCounselorsAccountsArgs
			>({
				query: (args) => ({
					url: `/api/counselors/academic?search=${args.search}&ratingFrom=${args.ratingFrom}&ratingTo=${args.ratingTo}&availableFrom=${args.availableFrom}&availableTo=${args.availableTo}&specializationId=${args.specializationId}&SortDirection=${args.sortDirection}&sortBy=${args.sortBy}&page=${args.page}`
				}),
                providesTags: ['a-counselors']
			}),
            getOneAcademicCounselorAccount: build.query<
				getOneAcademicCounselorAccountResponse,
				getOneAcademicCounselorAccountArgs
			>({
				query: (args) => ({
                    url: `/api/counselor/academic/id=${args.id}`
				}),
                providesTags: ['a-counselor']
			}),
            getNonAcademicCounselorsAccounts: build.query<
				getNonAcademicCounselorsAccountsResponse,
				getNonAcademicCounselorsAccountsArgs
			>({
				query: (args) => ({
					url: `/api/counselors/non-academic?search=${args.search}&ratingFrom=${args.ratingFrom}&ratingTo=${args.ratingTo}&availableFrom=${args.availableFrom}&availableTo=${args.availableTo}&specializationId=${args.specializationId}&SortDirection=${args.sortDirection}&sortBy=${args.sortBy}&page=${args.page}`
				}),
                providesTags: ['na-counselors']
			}),
            getOneNonAcademicCounselorsAccounts: build.query<
				getOneNonAcademicCounselorAccountResponse,
				getOneNonAcademicCounselorAccountArgs
			>({
				query: (args) => ({
                    url: `/api/counselor/non-academic/id=${args.id}`
				}),
                providesTags: ['na-counselor']
			}),
		}),
	});

export const {} = adminApi;

type getAcademicCounselorsAccountsResponse = ApiResponse<Account[]>;
type getAcademicCounselorsAccountsArgs = {
	search?: string;
	ratingFrom?: number;
	ratingTo?: number;
	availableFrom?: string;
	availableTo?: string;
	specializationId?: number;
	sortBy?: 'fullName' | 'id';
	page?: number;
	sortDirection: 'ASC' | 'DESC';
};

type getOneAcademicCounselorAccountResponse = ApiResponse<Account>;
type getOneAcademicCounselorAccountArgs = {
	id: number
};

type getNonAcademicCounselorsAccountsResponse = ApiResponse<Account[]>;
type getNonAcademicCounselorsAccountsArgs = {
	search?: string;
	ratingFrom?: number;
	ratingTo?: number;
	availableFrom?: string;
	availableTo?: string;
	specializationId?: number;
	sortBy?: 'fullName' | 'id';
	page?: number;
	sortDirection: 'ASC' | 'DESC';
};

type getOneNonAcademicCounselorAccountResponse = ApiResponse<Account>;
type getOneNonAcademicCounselorAccountArgs = {
	id: string
};
