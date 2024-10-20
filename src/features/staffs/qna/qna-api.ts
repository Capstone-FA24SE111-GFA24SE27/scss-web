import {
	Account,
	Counselor,
	PaginationContent,
	Question,
	Student,
	User,
} from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = ['qna'] as const;

export const usersApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getQuestions: build.query<
				GetQuestionsApiResponse,
				GetQuestionsApiArgs
			>({
				query: ({
					keyword = '',
					sortBy = 'createdDate',
					sortDirection = 'DESC',
					page = '1',
					type = '',
					studentCode = '',
				}) => ({
					url: `/api/question-cards/review/filter?${
						keyword.length > 0 ? `keyword=${keyword}` : ''
					}sortBy=${sortBy}&sortDirection=${sortDirection}&page=${page}${
						studentCode.length > 0
							? `&studentCode=${studentCode}`
							: ''
					}${type.length > 0 ? `&type=${type}` : ''}`,
				}),
				providesTags: ['qna'],
			}),
			getQuestion: build.query<GetQuestionApiResponse, string>({
				query: (questionCardId) => ({
					url: `/api/question-cards/review/${questionCardId}`,
				}),
				providesTags: ['qna'],
			}),
			postReviewQuestionStatus: build.mutation<
				PostReviewQuestionResponse,
				PostReviewQuestionArg
			>({
				query: (args) => ({
					url: `/api/question-cards/review/${args.id}/${args.status}`,
					method: 'POST',
				}),
				invalidatesTags: ['qna'],
			}),
		}),
	});

export const {
	useGetQuestionsQuery,
	useGetQuestionQuery,
	usePostReviewQuestionStatusMutation,
} = usersApi;

export type GetQuestionsApiResponse = ApiResponse<PaginationContent<Question>>;

export type GetQuestionApiResponse = ApiResponse<Question>;

export type GetQuestionsApiArgs = {
	sortBy?: string;
	keyword?: string;
	type?: 'ACADEMIC' | 'NON-ACADEMIC' | '';
	studentCode?: string;
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
};

export type PostReviewQuestionArg = {
	id: number;
	status: 'PENDING' | 'VERIFIED' | 'FLAGGED' | 'REJECTED';
};
export type PostReviewQuestionResponse = {
	message: string;
	status: number;
};
