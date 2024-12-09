import { ApiMessage, ApiResponse, apiService as api } from '@shared/store';
import { PaginationContent, Question, QuestionPayload } from '@shared/types';


export const addTagTypes = [
  'qna', 'one-qna'
] as const;


export const studentQnasApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStudentQuestions: build.query<GetStudentQuestionsApiResponse, GetStudentQuestionsApiArg>({
        query: ({
          keyword = '',
          status = '',
          isTaken = '',
          isClosed = '',
          type = '',
          sortBy = 'createdDate',
          sortDirection = 'DESC',
          page = 1,
          topicId = ''
        }) => ({
          url: `/api/question-cards/student/filter`,
          method: 'GET',
          params: {
            keyword,
            status,
            isTaken,
            isClosed,
            type,
            sortBy,
            sortDirection,
            page,
            topicId
          },
        }),
        providesTags: ['qna']
      }),
      getMyStudentQuestions: build.query<GetStudentQuestionsApiResponse, GetStudentQuestionsApiArg>({
        query: ({ }) => ({
          url: `/api/question-cards/student/filter`,
          params: {
            status: 'VERIFIED',
            isClosed: false,
            sortBy: 'createdDate',
            sortDirection: 'DESC',
            page: 1,
            size: 999,
          },
          method: 'GET',
        }),
        providesTags: ['qna']
      }),
      postQuestion: build.mutation<void, PostQuestionApiArg>({
        query: (arg) => ({
          url: `/api/question-cards`,
          method: 'POST',
          body: arg
        }),
        invalidatesTags: ['qna']
      }),
      editQuestion: build.mutation<void, EditQuestionApiArg>({
        query: (arg) => ({
          url: `/api/question-cards/edit/${arg.questionCardId}`,
          method: 'PUT',
          body: arg.question
        }),
        invalidatesTags: ['qna']
      }),
      getStudentQuestion: build.query<GetQuestionApiResponse, string>({
        query: (questionCardId) => ({
          url: `/api/question-cards/student/${questionCardId}`,
        }),
        providesTags: ['one-qna']
      }),
      getBanInfo: build.query<GetBanInfoApiResponse, void>({
        query: () => ({
          url: `/api/question-cards/student/ban-info`,
          method: 'GET',
        }),
        providesTags: ['qna']
      }),
      closeQuestionStudent: build.mutation<CloseQuestionApiResponse, number>({
        query: (questionCardId) => ({
          url: `/api/question-cards/student/close/${questionCardId}`,
          method: 'POST'
        }),
        invalidatesTags: ['qna']
      }),
      deleteQuestionStudent: build.mutation<ApiMessage, number>({
        query: (questionCardId) => ({
          url: `/api/question-cards/delete/${questionCardId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['qna']
      }),
      createChatSessionStudent: build.mutation<CreateChatSessionResponse,number>({
        query: (questionCardId) => ({
          url: `/api/question-cards/student/chat-session/create/${questionCardId}`,
          method: 'POST'
        }),
        invalidatesTags: ['qna']

      })
    })
  })

export const {
  useGetStudentQuestionsQuery,
  usePostQuestionMutation,
  useEditQuestionMutation,
  useGetStudentQuestionQuery,
  useGetMyStudentQuestionsQuery,
  useGetBanInfoQuery,
  useCloseQuestionStudentMutation,
  useDeleteQuestionStudentMutation,
  useCreateChatSessionStudentMutation
} = studentQnasApi

export type GetStudentQuestionsApiResponse = ApiResponse<PaginationContent<Question>>

export type GetQuestionApiResponse = ApiResponse<Question>

export type GetStudentQuestionsApiArg = {
  keyword?: string;
  status?: string;
  isTaken?: boolean | string;
  isClosed?: boolean | string;
  type?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  topicId?: string
};

export type PostQuestionApiArg = QuestionPayload

type CreateChatSessionResponse = ApiMessage;

export type EditQuestionApiArg = {
  questionCardId: number,
  question: QuestionPayload
}

type CloseQuestionApiResponse = ApiMessage

export type GetBanInfoApiResponse = BanInfo
export type BanInfo = {
  banStartDate: string;
  banEndDate: string;
  questionFlags: {
    id: number;
    reason: string;
    flagDate: string;
    questionCard: Question;
  }[]
  ban: boolean;
};