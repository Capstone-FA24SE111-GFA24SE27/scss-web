import {
	Account,
	ContributedQuestionCategory,
	PaginationContent,
	Role,
} from '@/shared/types';
import { apiService, ApiResponse, ApiMessage } from '@shared/store';
import { url } from 'inspector';

const addTagTypes = ['qna', 'qna-category'] as const;

export const questionCardsApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getContributedQuestionCardCategory: build.query<
				GetContributedQuestionCardCategoryResponse,
				void
			>({
				query: () => ({
					url: `/api/contribution-question-cards/categories`,
				}),
				providesTags: ['qna-category'],
			}),
			postCreateQuestionCategoryAdmin: build.mutation<
				PostCreateQuestionCategoryAdminResponse,
				PostCreateQuestionCategoryAdminArgs
			>({
				query: (args) => ({
					url: `/api/contribution-question-cards/categories`,
					method: 'POST',
					body: args,
				}),
				invalidatesTags: ['qna-category'],
			}),
			putUpdateQuestionCategoryAdmin: build.mutation<
				PostCreateQuestionCategoryAdminResponse,
				PostCreateQuestionCategoryAdminArgs
			>({
				query: (args) => ({
					url: `/api/contribution-question-cards/categories/${args.id}`,
					method: 'PUT',
					body: args,
				}),
				invalidatesTags: ['qna-category'],
			}),
			deleteQuestionCategoryAdmin: build.mutation<
				PostCreateQuestionCategoryAdminResponse,
				string | number
			>({
				query: (id) => ({
					url: `/api/contribution-question-cards/categories/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['qna-category'],
			}),
		}),
	});

export const {
	useGetContributedQuestionCardCategoryQuery,
	useDeleteQuestionCategoryAdminMutation,
	usePostCreateQuestionCategoryAdminMutation,
	usePutUpdateQuestionCategoryAdminMutation,
} = questionCardsApi;

type GetContributedQuestionCardCategoryResponse = ApiResponse<
	ContributedQuestionCategory[]
>;
type GetContributedQuestionCardCategoryArgs = {};

type PostCreateQuestionCategoryAdminResponse = ApiResponse<ContributedQuestionCategory>;
type PostCreateQuestionCategoryAdminArgs = {
	id?: string;
	name: string;
	type: 'ACADEMIC' | 'NON_ACADEMIC';
};
