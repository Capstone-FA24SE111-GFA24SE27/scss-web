import { roles } from '@/shared/constants';
import { roleBasedNavigation } from '@/shared/layouts/layout-components/navigation';
import { Account, CertificationList, PaginationContent, QualificationList, Role } from '@/shared/types';
import { apiService, ApiResponse, ApiMessage } from '@shared/store';

const addTagTypes = ['accounts'] as const;

export const adminAccountsApi = apiService
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
					size = 10,
				}) => ({
					url: `/api/account`,
					params: {
						search,
						status,
						sortBy,
						page,
						SortDirection,
						role,
						size
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
			postCreateAcademicCounselorAccount: build.mutation<
				postCreateAcademicCounselorAccountRepsonse,
				postCreateAcademicCounselorAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/create/academic-counselor`,
					method: 'POST',
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.ACADEMIC_COUNSELOR },
				],
			}),
			postCreateNonAcademicCounselorAccount: build.mutation<
				postCreateNonAcademicCounselorAccountRepsonse,
				postCreateNonAcademicCounselorAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/create/non-academic-counselor`,
					method: 'POST',
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.NON_ACADEMIC_COUNSELOR },
				],
			}),
			postCreateSupportStaffAccount: build.mutation<
				postCreateSupportStaffAccountRepsonse,
				postCreateSupportStaffAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/create/support-staff`,
					method: 'POST',
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.SUPPORT_STAFF },
				],
			}),
			postCreateManagerAccount: build.mutation<
				postCreateManagerAccountRepsonse,
				postCreateManagerAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/create/manager`,
					method: 'POST',
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.MANAGER },
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
	usePostCreateAcademicCounselorAccountMutation,
	usePostCreateManagerAccountMutation,
	usePostCreateNonAcademicCounselorAccountMutation,
	usePostCreateSupportStaffAccountMutation,
} = adminAccountsApi;

type postCreateSupportStaffAccountRepsonse = ApiMessage;
type postCreateSupportStaffAccountArgs = {
	avatarLink: string;
	email: string;
	password: string;
	gender: 'MALE' | 'FEMALE';
	phoneNumber: string;
	dateOfBirth: string;
	fullName: string;
};

type postCreateManagerAccountRepsonse = ApiMessage;
type postCreateManagerAccountArgs = {
	avatarLink: string;
	email: string;
	password: string;
	gender: 'MALE' | 'FEMALE';
	phoneNumber: string;
	dateOfBirth: string;
	fullName: string;
};

type postCreateAcademicCounselorAccountRepsonse = ApiMessage;
type postCreateAcademicCounselorAccountArgs = {
	avatarLink: string;
	email: string;
	password: string;
	gender: 'MALE' | 'FEMALE';
	phoneNumber: string;
	dateOfBirth: string;
	fullName: string;
	departmentId: string | number;
	majorId: string | number;
	specializationId: string | number;
	specializedSkills?: string,
	otherSkills?: string,
	workHistory?: string,
	achievements?: string,
	qualifications?: Omit<QualificationList, 'id'>,
	certifications?: Omit<CertificationList, 'id'>
};

type postCreateNonAcademicCounselorAccountRepsonse = ApiMessage;
type postCreateNonAcademicCounselorAccountArgs = {
	avatarLink: string;
	email: string;
	password: string;
	gender: 'MALE' | 'FEMALE';
	phoneNumber: string;
	dateOfBirth: string;
	fullName: string;
	expertiseId: string | number;
	specializedSkills?: string,
	otherSkills?: string,
	workHistory?: string,
	achievements?: string,
	qualifications?: Omit<QualificationList, 'id'>,
	certifications?: Omit<CertificationList, 'id'>
};

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
type putUpdateAccountStatusResponse = ApiMessage;

type getAccountsResponse = ApiResponse<PaginationContent<Account>>;
type getAccountsArgs = {
	search?: string;
	status?: 'ACTIVE' | 'INACTIVE';
	sortBy?: 'fullName' | 'id';
	page?: number;
	SortDirection?: 'ASC' | 'DESC';
	role: Role;
	size?: number;
};

type getOneAccountResponse = ApiResponse<Account>;
type getOneAccountArgs = {
	id: number | string;
};
