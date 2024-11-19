
import { PaginationContent, Profile, Student } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = ['students'] as const;

export const staffFollowedStudentsApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getFollowedStudentsStaff: build.query<
				GetStudentsFilterApiResponse,
				GetStudentsFilterApiArg
			>({
				query: ({
					size,
					page = 1,
				}) => ({
					url: `/api/support-staff/following`,
					params: {
						size,
						page,
					},
				}),
				providesTags: ['students'],
			}),
            postFollowStudentsStaff: build.mutation<
				PostFollowStudentsApiResponse,
				PostFollowStudentsApiArg
			>({
				query: (arg) => ({
					url: `/api/support-staff/follow/${arg}`,
					method: 'POST'
				}),
				invalidatesTags: ['students'],
			}),
            getStudentFollowStatus: build.query<
            GetStudentsFollowStatusApiResponse,
            GetStudentsFollowStatusApiArg
        >({
            query: (arg) => ({
                url: `/api/support-staff/check-follow/${arg}`,
                
            }),
            providesTags: ['students'],
        }),
		}),
	});

export const {
	useGetFollowedStudentsStaffQuery,
    usePostFollowStudentsStaffMutation,
    useGetStudentFollowStatusQuery
} = staffFollowedStudentsApi;

export type GetStudentsFilterApiResponse = ApiResponse<PaginationContent<Student>>;
export type GetStudentsFilterApiArg = {
	size?: number;
	page?: number;
};

export type PostFollowStudentsApiResponse = any
export type PostFollowStudentsApiArg = number | string;

export type GetStudentsFollowStatusApiResponse = ApiResponse<FollowStatusResponse>;

type FollowStatusResponse = {
    followed: boolean,
    studentFollowingDTO: {
        student: Student,
        followDate: string,
        followNote: string
    },
    supportStaffDTO: {
        id: number,
        profile: Profile
    },
    your: boolean
}

export type GetStudentsFollowStatusApiArg = number | string