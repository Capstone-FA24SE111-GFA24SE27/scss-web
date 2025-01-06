import {
	Account,
	Counselor,
	PaginationContent,
	Question,
	Student,
	User,
} from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

const addTagTypes = ['qna'] as const;

const qnaDetailApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getCounselorQnaDetail: build.query<GetQuestionApiResponse, string>({
				query: (questionCardId) => ({
					url: `/api/question-cards/counselor/${questionCardId}`,
				}),
				providesTags: (result, error, arg) => [{ type: 'qna', id: arg }]
			}),
			getStudentQnaDetail: build.query<GetQuestionApiResponse, string>({
				query: (questionCardId) => ({
					url: `/api/question-cards/student/${questionCardId}`,
				}),
				providesTags: (result, error, arg) => [{ type: 'qna', id: arg }]
			}),
		}),
	});

export const {
	useGetCounselorQnaDetailQuery,
	useGetStudentQnaDetailQuery,
} = qnaDetailApi;

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

export type TypeOfQuestionType = 'ACADEMIC' | 'NON-ACADEMIC' | ''

export type PostReviewQuestionArg = {
	id: number;
	status: 'PENDING' | 'VERIFIED' | 'FLAGGED' | 'REJECTED';
};
export type PostReviewQuestionResponse = {
	message: string;
	status: number;
};

export type PostFlagQuestionArg = {
	id: number;
	body: string;
};
export type PostFlagQuestionResponse = {
	message: string;
	status: number;
};
