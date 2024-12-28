import {
	Account,
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
			getQuestionCardAdmin: build.query<
				GetQuestionCardAdminResponse,
				GetQuestionCardAdminArgs
			>({
				query: ({
					keyword = '',
					status,
					publicStatus,
					type = 'ACADEMIC',
					sortBy,
					sortDirection = 'ASC',
					page = 0,
					size = 10,
				}) => ({
					url: `/api/manage/question-cards/filter`,
					params: {
						keyword,
						status,
						publicStatus,
						type,
						sortBy,
						sortDirection,
						page,
						size,
					},
				}),
				providesTags: ['qna'],
			}),
			putUpdateQuestionPublicStatusAdmin: build.mutation<
				PostCreateQuestionPublicStatusAdminResponse,
				PostCreateQuestionPublicStatusAdminArgs
			>({
				query: ({ questionCardId, questionCardPublicStatus }) => ({
					url: `/api/manage/question-cards/public-status/${questionCardId}/${questionCardPublicStatus}`,
					method: 'PUT',
				}),
				invalidatesTags: ['qna'],
			}),
		}),
	});

export const {
	useGetQuestionCardAdminQuery,
	usePutUpdateQuestionPublicStatusAdminMutation,
} = questionCardsApi;

type GetQuestionCardAdminResponse = ApiResponse<PaginationContent<Question>>;
type GetQuestionCardAdminArgs = {
	keyword?: string;
	status?: 'PENDING' | 'FLAGGED' | 'VERIFIED' | 'REJECTED';
	publicStatus?: 'HIDE' | 'VISIBLE' | 'PENDING';
	type?: 'ACADEMIC' | 'NON_ACADEMIC';
	sortBy?: string;
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
	size?: number;
};

type PostCreateQuestionPublicStatusAdminResponse =
	ApiResponse<ContributedQuestionCategory>;
type PostCreateQuestionPublicStatusAdminArgs = {
	questionCardId: string | number;
	questionCardPublicStatus: 'PENDING' | 'HIDE' | 'VISIBLE';
};
