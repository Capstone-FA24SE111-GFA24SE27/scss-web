import { roles } from '@/shared/constants';
import { roleBasedNavigation } from '@/shared/layouts/layout-components/navigation';
import { Account, Role } from '@/shared/types';
import { apiService, ApiResponse } from '@shared/store';

const addTagTypes = ['accounts'] as const;

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
				providesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.ACADEMIC_COUNSELOR },
				],
			}),
			getOneAcademicCounselorAccount: build.query<
				getOneAcademicCounselorAccountResponse,
				getOneAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/${args.id}`,
				}),
				providesTags: ['accounts'],
			}),
			putBlockAccount: build.mutation<
				putUpdateAccountStatusResponse,
				putUpdateAccountStatusArg
			>({
				query: ({ id, role }) => ({
					url: `/api/account/${id}/block`,
					method: 'PUT',
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: arg.role },
				],
			}),
			putUnblockAccount: build.mutation<
				putUpdateAccountStatusResponse,
				putUpdateAccountStatusArg
			>({
				query: ({id, role}) => ({
					url: `/api/account/${id}/unblock`,
					method: 'PUT',
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: arg.role },
				],
			}),
			postCreateAccount: build.mutation<
			postCreateAccountRepsonse,
			postCreateAccountArgs
		>({
			query: (args) => ({
				url: `/api/account/create`,
				method: 'POST',
				body: args 
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'accounts', id: arg.role },
			],
		}),
		}),
	});

export const {} = adminApi;

type postCreateAccountArgs = {
	email: string,
  login: {
    method: 'DEFAULT' | "",
    password: string
  },
  profile: {
    id: number,
    fullName: string,
    phoneNumber: string,
    dateOfBirth: number,
    avatarLink: string,
    gender: "MALE" | "FEMALE"
  },
  role: Role
}

type postCreateAccountRepsonse = {

}

type putUpdateAccountStatusArg = {
	id: number | string;
	role: string;
};
type putUpdateAccountStatusResponse = {};

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
