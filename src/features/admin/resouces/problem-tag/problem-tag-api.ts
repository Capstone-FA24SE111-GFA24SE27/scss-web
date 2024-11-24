import { Account, PaginationContent, Role } from '@/shared/types';
import { ProblemTag, ProblemTagCategory } from '@/shared/types/admin';
import { apiService, ApiResponse } from '@shared/store';

const addTagTypes = ['tags', 'tag-categories'] as const;

export const problemTagsApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getProblemTags: build.query<
				getProblemTagsResponse,
				getProblemTagsArgs
			>({
				query: ({
					keyword = '',
					problemCategoryId = '',
					sortBy = 'createdDate',
					sortDirection = 'ASC',
					page = 1,
					size = 10,
				}) => ({
					url: `/api/problem-tags/filter?keyword=${keyword}&problemCategory=${problemCategoryId}&sortBy=${sortBy}&sortDirection=${sortDirection}&page=${page}&size=${size}`,
				}),
				providesTags: ['tags'],
			}),
			getProblemTagsCategories: build.query<
				getProblemTagsCategoriesResponse,
				getProblemTagsCategoriesArgs
			>({
				query: () => ({
					url: `/api/problem-tags/problem-category`,
				}),
				providesTags: ['tag-categories'],
			}),
			postProblemTag: build.mutation<
				postProblemTagResponse,
				postProblemTagArgs
			>({
				query: (args) => ({
					url: `/api/problem-tags/problem-tag`,
					method: 'POST',
					body: {
						args,
					},
				}),
				invalidatesTags: ['tags'],
			}),
			postProblemTagsCategory: build.mutation<
				postProblemTagsCategoryResponse,
				postProblemTagsCategoryArgs
			>({
				query: (args) => ({
					url: `/api/problem-tags/problem-category`,
					method: 'POST',
					body: {
						args,
					},
				}),
				invalidatesTags: ['tag-categories'],
			}),
			updateProblemTag: build.mutation<
				updateProblemTagResponse,
				updateProblemTagArgs
			>({
				query: (args) => ({
					url: `/api/problem-tags/problem-tag/${args.id}`,
					method: 'PUT',
					body: {
						name: args.name,
						point: args.point,
						categoryId: args.categoryId
					},
				}),
				invalidatesTags: ['tags'],
			}),
			updateProblemTagsCategory: build.mutation<
				updateProblemTagsCategoryResponse,
				updateProblemTagsCategoryArgs
			>({
				query: (args) => ({
					url: `/api/problem-tags/problem-category/${args.id}`,
					method: 'PUT',
					body: {
						name: args.name
					},
				}),
				invalidatesTags: ['tag-categories'],
			}),
			deleteProblemTag: build.mutation<
				deleteProblemTagResponse,
				deleteProblemTagArgs
			>({
				query: (args) => ({
					url: `/api/problem-tags/problem-tag/${args.id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['tags'],
			}),
			deleteProblemTagsCategory: build.mutation<
				deleteProblemTagsCategoryResponse,
				deleteProblemTagsCategoryArgs
			>({
				query: (args) => ({
					url: `/api/problem-tags/problem-category/${args.id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['tag-categories'],
			}),
		}),
	});

export const {
	useDeleteProblemTagMutation,
	useDeleteProblemTagsCategoryMutation,
	useGetProblemTagsCategoriesQuery,
	useGetProblemTagsQuery,
	usePostProblemTagMutation,
	usePostProblemTagsCategoryMutation,
	useUpdateProblemTagMutation,
	useUpdateProblemTagsCategoryMutation
} = problemTagsApi;

type getProblemTagsArgs = {
	keyword?: string;
	problemCategoryId?: number;
	sortBy?: string;
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
	size?: number;
};

type getProblemTagsResponse = ApiResponse<PaginationContent<ProblemTag>>;

type getProblemTagsCategoriesArgs = {};

type getProblemTagsCategoriesResponse = ProblemTagCategory[];

type postProblemTagArgs = {
	name: string;
	point: number;
	categoryId: number;
};

type postProblemTagResponse = ApiResponse<ProblemTag>;

type postProblemTagsCategoryArgs = {
	name: string;
};

type postProblemTagsCategoryResponse = ApiResponse<ProblemTagCategory>;

type updateProblemTagArgs = {
	id: number,
	name: string;
	point: number;
	categoryId: number;
}
type updateProblemTagResponse = ApiResponse<ProblemTag>;

type updateProblemTagsCategoryArgs = {
	id: number,
	name: string;
}
type updateProblemTagsCategoryResponse = ApiResponse<ProblemTagCategory>;

type deleteProblemTagArgs = {
	id: number,
}
type deleteProblemTagResponse = {}

type deleteProblemTagsCategoryArgs = {
	id: number,
}
type deleteProblemTagsCategoryResponse = {}