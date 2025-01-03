import {
	Account,
	ContributedQuestionAdmin,
	ContributedQuestionCategory,
	PaginationContent,
	Question,
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
			getContributedQuestionAdmin: build.query<
				GetContributedQuestionResponse,
				GetContributedQuestionArgs
			>({
				query: ({
					categoryId,
					page = 1,
					counselorId,
					query,
					size = 10,
					sortBy = 'createdDate',
					sortDirection = 'DESC',
					status,
				}) => ({
					url: `/api/manage/contribution-question-cards/filter`,
					params: {
						categoryId,
						page,
						counselorId,
						query,
						size,
						sortBy,
						sortDirection,
						status,
					},
				}),
				providesTags: ['qna'],
			}),

			putUpdateContributedQuestionAdmin: build.mutation<
				PutUpdateQuestionAdminResponse,
				PutUpdateQuestionAdminArgs
			>({
				query: (args) => ({
					url: `/api/manage/contribution-question-cards/public-status/${args.id}/${args.status}`,
					method: 'PUT',
				}),
				invalidatesTags: ['qna'],
			}),
			getContributedQuestionCardCategoryById: build.query<
				ApiResponse<ContributedQuestionCategory>,
				string | number
			>({
				query: (id) => ({
					url: `/api/contribution-question-cards/categories/${id}`,
				}),
				providesTags: ['qna-category'],
			}),
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
	useGetContributedQuestionCardCategoryByIdQuery,
	useGetContributedQuestionCardCategoryQuery,
	useDeleteQuestionCategoryAdminMutation,
	usePostCreateQuestionCategoryAdminMutation,
	usePutUpdateQuestionCategoryAdminMutation,
	useGetContributedQuestionAdminQuery,
	usePutUpdateContributedQuestionAdminMutation,
} = questionCardsApi;

type GetContributedQuestionCardCategoryResponse = ApiResponse<
	ContributedQuestionCategory[]
>;
type GetContributedQuestionCardCategoryArgs = {};

type PostCreateQuestionCategoryAdminResponse =
	ApiResponse<ContributedQuestionCategory>;
type PostCreateQuestionCategoryAdminArgs = {
	id?: string;
	name: string;
	type: 'ACADEMIC' | 'NON_ACADEMIC';
};

type GetContributedQuestionResponse = ApiResponse<PaginationContent<ContributedQuestionAdmin>>;

type GetContributedQuestionArgs = {
	query?: string;
	status?: 'HIDE' | 'VISIBLE';
	counselorId?: string | number;
	categoryId?: string | number;
	sortBy?: 'createdDate' | 'id';
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
	size?: number;
};

type PutUpdateQuestionAdminResponse = ApiMessage;
type PutUpdateQuestionAdminArgs = {
	id: string | number;
	status: 'HIDE' | 'VISIBLE';
};
