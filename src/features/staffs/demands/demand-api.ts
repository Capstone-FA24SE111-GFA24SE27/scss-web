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

export const addTagTypes = ['demands', 'counselors', 'counselor'] as const;

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
			getMatchCounselorForStudentStaff: build.query<
				GetMatchCounselorForStudentStaffResponse,
				GetMatchCounselorForStudentStaffArg
			>({
				query: ({ slotId, reason, date, gender }) => ({
					url: `/api/counselors/random/match`,
					params: {
						slotId,
						reason,
						date,
						gender,
					},
				}),
				providesTags: ['counselor'],
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
				providesTags: ['counselor'],
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
					departmentId,
					majorId,
					specializationId,
					availableFrom = '',
					gender,
					availableTo = '',
				}) => ({
					url: `/api/counselors/academic`,
					params: {
						search,
						page,
						departmentId,
						majorId,
						specializationId,
						availableFrom,
						availableTo,
						ratingFrom,
						gender,
						ratingTo,
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
					gender,
					sortBy = '',
					sortDirection = '',
					availableFrom = '',
					availableTo = '',
					expertiseId,
				}) => ({
					url: `/api/counselors/non-academic`,
					params: {
						search,
						page,
						availableFrom,
						availableTo,
						ratingFrom,
						ratingTo,
						gender,
						expertiseId,
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
			getQuickMatchCounselorForStaff: build.mutation<
				GetQuickMatchCounselorForStaffResponse,
				GetQuickMatchCounselorForStaffArgs
			>({
				query: ({
					counselorGender,
					expertiseId,
					departmentId,
					specializationId,
					majorId,
					matchType,
				}) => ({
					url:
						matchType === 'ACADEMIC'
							? `/api/support-staff/academic/match`
							: `/api/support-staff/non-academic/match`,
					params: {
						gender: counselorGender,
						expertiseId,
						departmentId,
						specializationId,
						majorId,
					},
					//Object.fromEntries(
					// 	Object.entries({
					// 		counselorGender,
					// 		expertiseId,
					// 		departmentId,
					// 		specializationId,
					// 		majorId,
					// 	}).filter(([_, value]) => value !== null)
					//),
					method: 'GET',
				}),
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
	useGetDemandByIdForStaffQuery,
	useGetQuickMatchCounselorForStaffMutation,
	useGetMatchCounselorForStudentStaffQuery,
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

export type GetMatchCounselorForStudentStaffResponse = ApiResponse<Counselor[]>;
export type GetMatchCounselorForStudentStaffArg = {
	slotId?: number | string;
	date?: string;
	gender?: 'MALE' | 'FEMAlE';
	reason: string;
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
		additionalInformation: string;
		causeDescription: string;
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
	specializationId?: number | string;
	departmentId?: number | string;
	majorId?: number | string;
	expertiseId?: number | string;
	gender?: 'MALE' | 'FEMALE';
};

type GetCounselorApiAcademicResponse = ApiResponse<
	PaginationContent<Counselor>
>;

type GetQuickMatchCounselorForStaffArgs = {
	matchType: 'ACADEMIC' | 'NON_ACADEMIC';
	counselorGender: 'MALE' | 'FEMALE';
	expertiseId?: string;
	departmentId?: string;
	specializationId?: string;
	majorId?: string;
};
type GetQuickMatchCounselorForStaffResponse = ApiResponse<Counselor[]>;
