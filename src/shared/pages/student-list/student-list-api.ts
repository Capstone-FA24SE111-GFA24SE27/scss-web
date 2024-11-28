import { ApiResponse, apiService as api } from '@shared/store';
import { PaginationContent, Student } from '@shared/types';

const addTagTypes = ['students'] as const;

export const studentListApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getStudentsFilter: build.query<
				GetStudentsFilterApiResponse,
				GetStudentsFilterApiArg
			>({
				query: ({
					studentCode = '',
					specializationId = '',
					departmentId = '',
					majorId = '',
					currentTerm = '',
					semesterIdForGPA = '',
					minGPA = '',
					maxGPA = '',
					isUsingPrompt = false,
					semesterIdForBehavior = '',
					promptForBehavior = '',
					keyword = '',
					sortBy = 'createdDate',
					sortDirection = 'ASC',
					page = '',
					tab = '',
					behaviorList = '',
					typeOfAttendanceFilter = 'COUNT',
					semesterIdForAttendance = '',
					fromForAttendanceCount = '',
					toForAttendanceCount = '',
					fromForAttendancePercentage = '',
					toForAttendancePercentage = '',
					minSubjectForAttendance = '',
					size = 10,
				}) => {
					if (tab === '') {
						// Call the first API endpoint if the condition is met
						return {
							url: `/api/students/filter`,
							params: {
								studentCode,
								specializationId,
								departmentId,
								majorId,
								currentTerm,
								semesterIdForGPA,
								minGPA,
								maxGPA,
								isUsingPrompt,
								semesterIdForBehavior,
								promptForBehavior,
								keyword,
								sortBy,
								sortDirection,
								page,
								behaviorList,
								typeOfAttendanceFilter,
								semesterIdForAttendance,
								fromForAttendanceCount,
								toForAttendanceCount,
								fromForAttendancePercentage,
								toForAttendancePercentage,
								minSubjectForAttendance,
								size
							},
						};
					} else if (tab === 'RECOMMENDED') {
						return {
							url: `/api/students/recommendation/filter`,
							params: {
								studentCode,
								specializationId,
								departmentId,
								majorId,
								currentTerm,
								semesterIdForBehavior,
								promptForBehavior,
								keyword,
								sortBy,
								sortDirection,
								page,
								typeOfAttendanceFilter,
								semesterIdForAttendance,
								fromForAttendanceCount,
								toForAttendanceCount,
								fromForAttendancePercentage,
								toForAttendancePercentage,
								minSubjectForAttendance,
								size
							},
						};
					}
				},
				providesTags: ['students'],
			}),
			getRecommendedStudents: build.query<
				GetStudentsFilterApiResponse,
				GetStudentsFilterApiArg
			>({
				query: ({
					studentCode = '',
					specializationId = '',
					departmentId = '',
					majorId = '',
					currentTerm = '',
					semesterIdForBehavior = '',
					promptForBehavior = '',
					keyword = '',
					sortBy = 'createdDate',
					sortDirection = 'ASC',
					page = '',
				}) => ({
					url: `/api/students/recommendation/filter`,
					params: {
						studentCode,
						specializationId,
						departmentId,
						majorId,
						currentTerm,
						semesterIdForBehavior,
						promptForBehavior,
						keyword,
						sortBy,
						sortDirection,
						page,
					},
				}),
				providesTags: ['students'],
			}),
			putExcludeStudentProblemTags: build.mutation<PutExcludeStudentProblemTagsResponse, PutExcludeStudentProblemTagsArgs>({
				query: (arg) => ({
					url: `/api/students/problem-tag/exclude-all/${arg}`,
					method: 'PUT',
				}),
				invalidatesTags: ['students'],
			}),
		}),
	});

export const {
	useGetStudentsFilterQuery,
	useGetRecommendedStudentsQuery,
	usePutExcludeStudentProblemTagsMutation,
} = studentListApi;

// Define types for the updated API response and arguments
export type GetStudentsFilterApiResponse = PaginationContent<Student>;
export type GetStudentsFilterApiArg = {
	studentCode?: string;
	specializationId?: number | '';
	departmentId?: number | '';
	majorId?: number | '';
	currentTerm?: number;
	semesterIdForGPA?: number | '';
	minGPA?: number | '';
	maxGPA?: number | '';
	isUsingPrompt?: boolean;
	semesterIdForBehavior?: number | '';
	promptForBehavior?: string;
	keyword?: string;
	sortBy?: string;
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
	behaviorList?: string;
	tab?: string;
	typeOfAttendanceFilter?: 'COUNT' | 'PERCENTAGE';
	semesterIdForAttendance?: number | '';
	fromForAttendanceCount?: number | '';
	toForAttendanceCount?: number | '';
	fromForAttendancePercentage?: number | '';
	toForAttendancePercentage?: number | '';
	minSubjectForAttendance?: number | '';
	size?: number
};
type PutExcludeStudentProblemTagsArgs = number | string;
type PutExcludeStudentProblemTagsResponse = ApiResponse<string>;
