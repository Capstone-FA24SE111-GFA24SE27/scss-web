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

export const usersApi = api
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
					{ type: 'counselor', id: arg },
				],
			}),
		}),
	});

export const {
	useGetCounselingDemandFilterQuery,
	usePostCreateDemandByStudentIdMutation,
	usePutAssignDemandByDemandIdMutation,
	useGetCounselorByIdQuery
} = usersApi;

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
		summarizeNote: string;
		contactNote: string;
	};
};
type PutAssignDemandByDemandIdResponse = ApiResponse<CounselingDemand>;

type getCounselorByIdArg = number | string;
type getCounselorByIdReponse = ApiResponse<Counselor>;
