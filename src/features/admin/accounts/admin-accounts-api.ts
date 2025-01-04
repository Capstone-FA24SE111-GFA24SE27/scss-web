import { roles } from '@/shared/constants';
import { roleBasedNavigation } from '@/shared/layouts/layout-components/navigation';
import {
	Account,
	CertificationList,
	CounselingSlot,
	Counselor,
	PaginationContent,
	QualificationList,
	Role,
} from '@/shared/types';
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
						size,
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
			putUpdateAcademicCounselorAccount: build.mutation<
				PutUpdateAcademicCounselorAccountResponse,
				PutUpdateAcademicCounselorAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/create/academic-counselor`,
					method: 'PUT',
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.ACADEMIC_COUNSELOR },
					'accounts',
				],
			}),
			putUpdateNonAcademicCounselorAccount: build.mutation<
				PutUpdateNonAcademicCounselorAccountResponse,
				PutUpdateNonAcademicCounselorAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/create/non-academic-counselor`,
					method: 'PUT',
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.NON_ACADEMIC_COUNSELOR },
					'accounts',
				],
			}),
			putUpdateManagerAccount: build.mutation<
				PutUpdateManagerAccountResponse,
				PutUpdateManagerAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/create/manager`,
					method: 'PUT',
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.MANAGER },
					'accounts',
				],
			}),
			putUpdateStaffAccount: build.mutation<
				PutUpdateStaffAccountResponse,
				PutUpdateStaffAccountArgs
			>({
				query: (args) => ({
					url: `/api/account/create/support-staff`,
					method: 'PUT',
					body: args,
				}),
				invalidatesTags: (result, error, arg) => [
					{ type: 'accounts', id: roles.SUPPORT_STAFF },
					'accounts',
				],
			}),

			getCounselorAdmin: build.query<
				GetCounselorApiResponse,
				number | string
			>({
				query: (counselorId) => ({
					url: `/api/manage/counselors/${counselorId}`,
				}),
				providesTags: ['accounts'],
			}),

			postCreateQualification: build.mutation<
				PutUpdateQualificationResponse,
				PutUpdateQualificationArgs
			>({
				query: ({
					counselorId,
					degree,
					fieldOfStudy,
					institution,
					yearOfGraduation,
					imageUrl,
				}) => ({
					url: `/api/account/create/academic-counselor/${counselorId}/qualification`,
					method: 'POSt',
					body: {
						degree,
						fieldOfStudy,
						institution,
						yearOfGraduation,
						imageUrl,
					},
				}),
				invalidatesTags: ['accounts'],
			}),
			postCreateCertification: build.mutation<
				PutUpdateCertificationResponse,
				PutUpdateCertificationArgs
			>({
				query: ({ counselorId, name, organization, imageUrl }) => ({
					url: `/api/account/create/academic-counselor/${counselorId}/certification`,
					method: 'POSt',
					body: {
						name,
						organization,
						imageUrl,
					},
				}),
				invalidatesTags: ['accounts'],
			}),

			putUpdateQualification: build.mutation<
				PutUpdateQualificationResponse,
				PutUpdateQualificationArgs
			>({
				query: ({
					counselorId,
					id,
					degree,
					fieldOfStudy,
					institution,
					yearOfGraduation,
					imageUrl,
				}) => ({
					url: `/api/account/create/counselor/${counselorId}/qualification/${id}`,
					method: 'PUT',
					body: {
						id,
						degree,
						fieldOfStudy,
						institution,
						yearOfGraduation,
						imageUrl,
					},
				}),
				invalidatesTags: ['accounts'],
			}),
			putUpdateCertification: build.mutation<
				PutUpdateCertificationResponse,
				PutUpdateCertificationArgs
			>({
				query: ({ counselorId, id, name, organization, imageUrl }) => ({
					url: `/api/account/create/counselor/${counselorId}/certification/${id}`,
					method: 'PUT',
					body: {
						id,
						name,
						organization,
						imageUrl,
					},
				}),
				invalidatesTags: ['accounts'],
			}),

			deleteUpdateQualification: build.mutation<
				DeleteQualificationResponse,
				DeleteQualificationArgs
			>({
				query: ({ counselorId, id }) => ({
					url: `/api/account/create/counselor/${counselorId}/qualification/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['accounts'],
			}),
			deleteUpdateCertification: build.mutation<
				DeleteCertificationResponse,
				DeleteCertificationArgs
			>({
				query: ({ counselorId, id }) => ({
					url: `/api/account/create/counselor/${counselorId}/certification/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['accounts'],
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
	usePutUpdateAcademicCounselorAccountMutation,
	usePutUpdateNonAcademicCounselorAccountMutation,
	usePutUpdateManagerAccountMutation,
	usePutUpdateStaffAccountMutation,
	useGetCounselorAdminQuery,
	useDeleteUpdateCertificationMutation,
	useDeleteUpdateQualificationMutation,
	usePostCreateCertificationMutation,
	usePostCreateQualificationMutation,
	usePutUpdateCertificationMutation,
	usePutUpdateQualificationMutation,
} = adminAccountsApi;

type PutUpdateQualificationResponse = ApiMessage;
type PutUpdateQualificationArgs = {
	counselorId: number | string;
	id: number | string;
	degree: string;
	fieldOfStudy: string;
	institution: string;
	yearOfGraduation: number | string;
	imageUrl: string;
};

type DeleteQualificationResponse = ApiMessage;
type DeleteQualificationArgs = {
	counselorId: number | string;
	id: number | string;
};

type DeleteCertificationResponse = ApiMessage;
type DeleteCertificationArgs = {
	counselorId: number | string;
	id: number | string;
};

type PutUpdateCertificationResponse = ApiMessage;
type PutUpdateCertificationArgs = {
	counselorId: number | string;
	id: number | string;
	name: string;
	organization: string;
	imageUrl: string;
};

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
	// specializationId: string | number;
	specializedSkills?: string;
	otherSkills?: string;
	workHistory?: string;
	achievements?: string;
	qualifications?: Omit<QualificationList, 'id'>;
	certifications?: Omit<CertificationList, 'id'>;
};

type PutUpdateAcademicCounselorAccountResponse = ApiMessage;
type PutUpdateAcademicCounselorAccountArgs = {
	avatarLink?: string;
	email?: string;
	password?: string;
	gender?: 'MALE' | 'FEMALE';
	phoneNumber?: string;
	dateOfBirth?: string;
	fullName?: string;
	departmentId?: string | number;
	majorId?: string | number;
	// specializationId?: string | number;
	specializedSkills?: string;
	otherSkills?: string;
	workHistory?: string;
	achievements?: string;
	id: string | number;
};

type PutUpdateNonAcademicCounselorAccountResponse = ApiMessage;
type PutUpdateNonAcademicCounselorAccountArgs = {
	avatarLink?: string;
	email?: string;
	password?: string;
	gender?: 'MALE' | 'FEMALE';
	phoneNumber?: string;
	dateOfBirth?: string;
	fullName?: string;
	expertiseId?: string | number;
	// specializationId?: string | number;
	specializedSkills?: string;
	otherSkills?: string;
	workHistory?: string;
	achievements?: string;
	id: string | number;
};

type PutUpdateManagerAccountResponse = ApiMessage;
type PutUpdateManagerAccountArgs = {
	id: string | number;
	avatarLink?: string;
	email?: string;
	password?: string;
	gender?: 'MALE' | 'FEMALE';
	phoneNumber?: string;
	dateOfBirth?: string;
	fullName?: string;
};

type PutUpdateStaffAccountResponse = ApiMessage;
type PutUpdateStaffAccountArgs = {
	id: string | number;
	avatarLink?: string;
	email?: string;
	password?: string;
	gender?: 'MALE' | 'FEMALE';
	phoneNumber?: string;
	dateOfBirth?: string;
	fullName?: string;
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
	specializedSkills?: string;
	otherSkills?: string;
	workHistory?: string;
	achievements?: string;
	qualifications?: Omit<QualificationList, 'id'>;
	certifications?: Omit<CertificationList, 'id'>;
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

type postCreateAccountRepsonse = ApiMessage;

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
type GetCounselorApiResponse = ApiResponse<ManagementCounselor>;

type ManagementCounselor = {
	profile?: Counselor;
	availableDateRange: AvailableDateRange;
	counselingSlot: CounselingSlot[];
};

type AvailableDateRange = {
	startDate: string;
	endDate: string;
};
