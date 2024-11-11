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

export const addTagTypes = ['demands', 'counselors'] as const;

export const demandApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getCounselingDemandFilter: build.query<
				GetCounselingDemandFilterApiResponse,
				GetCounselingDemandFilterApiArg
			>({
				query: ({
					keyword = '',
					status = 'PROCESSING',
					sortBy = 'createdDate',
					sortDirection = 'DESC',
					page = 1,
				}) => ({
					url: `/api/counseling-demand/support-staff/filter`,
					params: {
						keyword,
						status,
						sortBy,
						sortDirection,
						page,
					},
				}),
				providesTags: ['demands'],
			}),
			postCreateDemandByStudentId: build.mutation<
				PostCreateDemandByStudentIdResponse,
				PostCreateDemandByStudentIdArg
			>({
				query: (arg) => {
					if (!arg) return null;
					return {
						url: `/api/counseling-demand/create/${arg}`,
						method: 'POST',
					};
				},
				invalidatesTags: ['demands'],
			}),
			putAssignDemandByDemandId: build.mutation<
				PutAssignDemandByDemandIdResponse,
				PutAssignDemandByDemandIdArgs
			>({
				query: (args) => {
					if (!args) return null;
					return {
						url: `/api/counseling-demand/update/${args.counselingDemandId}`,
						body: args.body,
						method: 'PUT',
					};
				},
				invalidatesTags: ['demands'],
			}),
			getCounselorById: build.query<
				getCounselorByIdReponse,
				getCounselorByIdArg
			>({
				query: (arg) => ({
					url: `/api/counselors/${arg}`,
				}),
				providesTags: (result, error, arg) => [
					{ type: 'counselors', id: arg },
				],
			}),
			getCounselors: build.query<getCounselorsReponse, getCounselorsArg>({
				query: ({
					search = '',
					SortDirection = 'ASC',
					sortBy = 'id',
					page = 1,
					ratingFrom,
					ratingTo,
				}) => ({
					url: `/api/counselors`,
					params: {
						search,
						SortDirection,
						sortBy,
						page,
						ratingFrom,
						ratingTo,
					},
				}),
				providesTags: ['counselors'],
			}),
			getCounselorsAcademic: build.query<
				GetCounselorApiAcademicResponse,
				GetCounselorsApiArg
			>({
				query: ({
					page = 1,
					ratingFrom = '',
					ratingTo = '',
					search = '',
					sortBy = '',
					sortDirection = '',
					availableFrom = '',
					availableTo = '',
				}) => ({
					url: `/api/counselors/academic`,
					params: {
						search,
						page,
						availableFrom,
						availableTo,
					},
				}),
				providesTags: ['counselors'],
			}),
			getCounselorsNonAcademic: build.query<
				GetCounselorApiAcademicResponse,
				GetCounselorsApiArg
			>({
				query: ({
					page = 1,
					ratingFrom = '',
					ratingTo = '',
					search = '',
					sortBy = '',
					sortDirection = '',
					availableFrom = '',
					availableTo = '',
				}) => ({
					url: `/api/counselors/non-academic`,
					params: {
						search,
						page,
						availableFrom,
						availableTo,
					},
				}),
				providesTags: ['counselors'],
			})
		}),
	});

export const {
	useGetCounselingDemandFilterQuery,
	usePostCreateDemandByStudentIdMutation,
	usePutAssignDemandByDemandIdMutation,
	useGetCounselorByIdQuery,
	useGetCounselorsAcademicQuery,
	useGetCounselorsNonAcademicQuery
} = demandApi;

export type GetCounselingDemandFilterApiResponse = ApiResponse<
	PaginationContent<CounselingDemand>
>;
export type GetCounselingDemandFilterApiArg = {
	keyword?: string;
	status?: string;
	sortBy?: string;
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
};

export type PostCreateDemandByStudentIdResponse = ApiResponse<CounselingDemand>;
export type PostCreateDemandByStudentIdArg = number | string;

type PutAssignDemandByDemandIdArgs = {
	counselingDemandId: number | string;
	body: {
		counselorId: number | string;
		// summarizeNote: string;
		contactNote: string;
	};
};
type PutAssignDemandByDemandIdResponse = ApiResponse<CounselingDemand>;

type getCounselorByIdArg = number | string;
type getCounselorByIdReponse = ApiResponse<Counselor>;

type getCounselorsArg = {
	search: string;
	SortDirection: string;
	sortBy: 'id' | '';
	page: number;
	ratingFrom?: number;
	ratingTo?: number;
};
type getCounselorsReponse = ApiResponse<PaginationContent<Counselor>>;

type GetCounselorsApiArg = {
	search?: string;
	sortDirection?: 'ASC' | 'DESC';
	sortBy?: string;
	page?: number;
	ratingFrom?: number;
	ratingTo?: number;
	availableFrom?: string;
	availableTo?: string;
};

type GetCounselorApiAcademicResponse = ApiResponse<
	PaginationContent<Counselor>
>;
