import { roles } from '@/shared/constants';
import { roleBasedNavigation } from '@/shared/layouts/layout-components/navigation';
import { Account, PaginationContent, Role } from '@/shared/types';
import { apiService, ApiResponse } from '@shared/store';

const addTagTypes = ['accounts'] as const;

export const adminApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAccounts: build.query<getAccountsResponse, getAccountsArgs>({
				query: ({
					search = '',
					status,
					sortBy = 'id',
					page = '1',
					SortDirection = 'ASC',
					role,
				}) => ({
					url: `/api/account`,
					params: {
						search,
						status,
						sortBy,
						page,
						SortDirection,
						role,
					},
				}),
				providesTags: (result, error, arg) => [
					{ type: 'accounts', id: arg.role },
				],
			}),
			getOneAccount: build.query<
				getOneAccountResponse,
				getOneAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/${args.id}`,
				}),
				providesTags: ['accounts'],
			}),
			putBlockAccountById: build.mutation<
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
			putUnblockAccountById: build.mutation<
				putUpdateAccountStatusResponse,
				putUpdateAccountStatusArg
			>({
				query: ({ id, role }) => ({
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
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: arg.role },
				],
			}),
		}),
	});

export const {
	useGetOneAccountQuery,
	useGetAccountsQuery,
	usePostCreateAccountMutation,
	usePutBlockAccountByIdMutation,
	usePutUnblockAccountByIdMutation,
} = adminApi;

type postCreateAccountArgs = {
	email: string;
	login: {
		method: 'DEFAULT' | '';
		password: string;
	};
	profile: {
		id: number;
		fullName: string;
		phoneNumber: string;
		dateOfBirth: number;
		avatarLink: string;
		gender: 'MALE' | 'FEMALE';
	};
	role: Role;
};

type postCreateAccountRepsonse = {};

type putUpdateAccountStatusArg = {
	id: number | string;
	role: string;
};
type putUpdateAccountStatusResponse = {};

type getAccountsResponse = ApiResponse<PaginationContent<Account>>;
type getAccountsArgs = {
	search?: string;
	status?: 'ACTIVE' | 'INACTIVE';
	sortBy?: 'fullName' | 'id';
	page?: number;
	SortDirection?: 'ASC' | 'DESC';
	role: Role;
};

type getOneAccountResponse = ApiResponse<Account>;
type getOneAccountArgs = {
	id: number;
};
