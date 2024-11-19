import {
	Account,
	CounselingDemand,
	Counselor,
	DemandType,
	PaginationContent,
	PriorityLevelType,
	Question,
	Student,
	User,
} from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = ['demands', 'counselors'] as const;

export const demandForStaffApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getCounselingDemandFilterForStaff: build.query<
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
			postCreateDemandByStudentIdForStaff: build.mutation<
				PostCreateDemandByStudentIdResponse,
				PostCreateDemandByStudentIdArg
			>({
				query: (args) => {
					if (!args) return null;
					return {
						url: `/api/counseling-demand/create/${args.studentId}`,
						method: 'POST',
						body: {
							counselorId: args.counselorId,
							priorityLevel: args.priorityLevel,
							additionalInformation: args.additionalInformation,
							issueDescription: args.issueDescription,
							causeDescription: args.causeDescription,
							contactNote: args.contactNote,
							demandType: args.demandType,
						},
					};
				},
				invalidatesTags: ['demands'],
			}),
			putUpdateDemandByDemandIdForStaff: build.mutation<
				PutUpdateDemandByDemandIdResponse,
				PutUpdateDemandByDemandIdArgs
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
			getCounselorByIdForStaff: build.query<
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
			getCounselorsForStaff: build.query<
				getCounselorsReponse,
				getCounselorsArg
			>({
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
			getCounselorsAcademicForStaff: build.query<
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
			getCounselorsNonAcademicForStaff: build.query<
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
			}),
			getDemandByIdForStaff: build.query<
				GetDemandByIdResponse,
				GetDemandByIdArg
			>({
				query: (arg) => ({
					url: `/api/counseling-demand/${arg}`,
				}),
				providesTags: ['demands'],
			}),
		}),
	});

export const {
	useGetCounselingDemandFilterForStaffQuery,
	usePostCreateDemandByStudentIdForStaffMutation,
	usePutUpdateDemandByDemandIdForStaffMutation,
	useGetCounselorByIdForStaffQuery,
	useGetCounselorsAcademicForStaffQuery,
	useGetCounselorsNonAcademicForStaffQuery,
	useGetDemandByIdForStaffQuery
} = demandForStaffApi;

type GetDemandByIdArg = number | string;
type GetDemandByIdResponse = CounselingDemand;

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
export type PostCreateDemandByStudentIdArg = {
	studentId: number | string;
	counselorId: number | string;
	priorityLevel: PriorityLevelType;
	additionalInformation: string;
	issueDescription: string;
	causeDescription: string;
	contactNote: string;
	demandType: DemandType;
};

type PutUpdateDemandByDemandIdArgs = {
	counselingDemandId: number | string;
	body: {
		counselorId: number | string;
		// summarizeNote: string;
		contactNote: string;
	};
};
type PutUpdateDemandByDemandIdResponse = ApiResponse<CounselingDemand>;

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
