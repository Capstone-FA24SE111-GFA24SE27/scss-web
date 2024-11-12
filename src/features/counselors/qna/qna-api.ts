import { Account, Counselor, PaginationContent, Question, Student, User } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'
import { Role } from '@/shared/constants';
import { Topic } from '@/shared/services';


export const addTagTypes = [
  'qna'
] as const;


export const counselorQnaApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselorQuestions: build.query<GetQuestionsApiResponse, GetQuestionsApiArg>({
        query: ({
          role,
          keyword = '',
          // isClosed = '',
          sortBy = 'createdDate',
          studentCode = '',
          sortDirection = 'DESC',
          page = 1,
          topicId
        }) => ({
          url: role === 'ACADEMIC_COUNSELOR'
            ? `/api/question-cards/library/academic-counselor/filter`
            : `/api/question-cards/library/non-academic-counselor/filter`
          ,
          method: 'GET',
          params: {
            keyword,
            sortBy,
            // studentCode,
            sortDirection,
            page,
            topicId
          },
        }),
        providesTags: ['qna']
      }),
      takeQuestion: build.mutation<void, number>({
        query: (questionCardId) => ({
          url: `/api/question-cards/counselor/take/${questionCardId}`,
          method: 'POST',
        }),
        invalidatesTags: ['qna']
      }),
      getMyCounselorQuestions: build.query<GetMyQuestionsApiResponse, GetMyQuestionsApiArg>({
        query: ({
          keyword = '',
          isClosed = '',
          isChatSessionClosed = '',
          sortBy = 'createdDate',
          // studentCode = null,
          sortDirection = 'DESC',
          page = 1,
          // topicId
        }) => ({
          url: `/api/question-cards/counselor/filter`,
          method: 'GET',
          params: {
            keyword,
            isClosed,
            isChatSessionClosed,
            sortBy,
            // studentCode,
            sortDirection,
            page,
            // topicId
          },
        }),
        providesTags: ['qna']
      }),
      answerQuestion: build.mutation<void, AnswerQuestionApiArg>({
        query: ({ questionCardId, content }) => ({
          url: `/api/question-cards/answer/${questionCardId}`,
          method: 'POST',
          body: { content }
        }),
        invalidatesTags: ['qna']
      }),
      editAnswer: build.mutation<void, AnswerQuestionApiArg>({
        query: ({ questionCardId, content }) => ({
          url: `/api/question-cards/answer/edit/${questionCardId}`,
          method: 'PUT',
        }),
        invalidatesTags: ['qna']
      }),
      getCounselorQuestion: build.query<GetQuestionApiResponse, string>({
        query: (questionCardId) => ({
          url: `/api/question-cards/counselor/${questionCardId}`,
        }),
        providesTags: (result, error, arg) => [{type: 'qna', id: arg}]
      }),
      closeQuestionCounselor: build.mutation<void, number>({
        query: (questionCardId) => ({
          url: `/api/question-cards/counselor/close/${questionCardId}`,
          method: 'POST',
        }),
        invalidatesTags: ['qna']
      }),
    })
  })

export const {
  useGetCounselorQuestionsQuery,
  useTakeQuestionMutation,
  useGetMyCounselorQuestionsQuery,
  useAnswerQuestionMutation,
  useGetCounselorQuestionQuery,
  useEditAnswerMutation,
  useCloseQuestionCounselorMutation
} = counselorQnaApi

export type GetQuestionsApiResponse = ApiResponse<PaginationContent<Question>>

export type GetQuestionApiResponse = ApiResponse<Question>

type GetQuestionsApiArg = {
  role: Role,
  keyword?: string;
  isClosed?: boolean | string;
  isChatSessionClosed?: boolean;
  sortBy?: string;
  studentCode?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  topicId?: string;
};

export type TakeQuestionApiResponse = ApiResponse<PaginationContent<Question>>

export type GetMyQuestionsApiResponse = ApiResponse<PaginationContent<Question>>

export type GetMyQuestionsApiArg = {
  keyword?: string;
  isClosed?: boolean | string;
  isChatSessionClosed?: boolean;
  sortBy?: string;
  studentCode?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  topicId?: string;
}

export type AnswerQuestionApiArg = {
  questionCardId: number,
  content: string
}