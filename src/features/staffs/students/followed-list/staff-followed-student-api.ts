import { PaginationContent, Profile, Student } from '@/shared/types';
import { Build, NumbersOutlined } from '@mui/icons-material';
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
				query: ({ size, page = 1 }) => ({
					url: `/api/support-staff/following`,
					params: {
						size,
						page,
					},
				}),
				providesTags: ['students'],
			}),
			postFollowStudentsStaff: build.mutation<
				string,
				PostFollowStudentsApiArg
			>({
				query: (arg) => ({
					url: `/api/support-staff/follow/${arg}`,
					method: 'POST',
					responseHandler: (response) => response.text()
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
			unfollowStudentStaff: build.mutation<
				UnfollowStudentApiResponse,
				UnfollowStudentApiArg
			>({
				query: (arg) => ({
					url: `/api/support-staff/unfollow/${arg}`,
					method: 'DELETE',
					responseHandler: (response) => response.text()
				}),
				invalidatesTags: ['students'],
			}),
			updateFollowNote: build.mutation<string, UpdateFollowNoteApiArg>({
				query: ({
					id,
					followNote
				}) => ({
					url: `/api/support-staff/update-follow-note/${id}`,
					method: 'PUT',
					responseHandler: (response) => response.text(),
					body: {
						followNote
					},
				}),
				invalidatesTags: ['students']
			})
		}),
	});

export const {
	useGetFollowedStudentsStaffQuery,
	usePostFollowStudentsStaffMutation,
	useGetStudentFollowStatusQuery,
	useUnfollowStudentStaffMutation,
	useUpdateFollowNoteMutation
} = staffFollowedStudentsApi;

export type GetStudentsFilterApiResponse = ApiResponse<
	PaginationContent<FollowedDTOType>
>;
export type GetStudentsFilterApiArg = {
	size?: number;
	page?: number;
};

export type PostFollowStudentsApiResponse = string;
export type PostFollowStudentsApiArg = number | string;

export type GetStudentsFollowStatusApiResponse =
	ApiResponse<FollowStatusResponse>;
	
	export type FollowStatusResponse = {
		followed: boolean;
		studentFollowingDTO: FollowedDTOType;
		supportStaffDTO: {
			id: number;
			profile: Profile;
		};
		your: boolean;
};


export type FollowedDTOType = {
	followDate: string;
	followNote: string;
	student: Student;
};

export type GetStudentsFollowStatusApiArg = number | string;

type UnfollowStudentApiResponse = string;
type UnfollowStudentApiArg = number | string;

type UpdateFollowNoteApiResponse = string;
type UpdateFollowNoteApiArg = {
	id: number | string;
	followNote: string
}