import { Account, Counselor, PaginationContent, Student, User } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'
import { Role } from '@/shared/constants';


export const addTagTypes = [
  'qna'
] as const;


export const usersApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getQuestions: build.query<GetQuestionsApiResponse, GetQuestionsApiArg>({
        query: ({ role }) => ({
          url: role
            ? `/api/question-cards/library/academic-counselor/filter`
            : `/api/question-cards/library/non-academic-counselor/filter`
          ,
          method: 'GET',
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
      getMyQuestions: build.query<GetMyQuestionsApiResponse, GetMyQuestionsApiArg>({
        query: ({ }) => ({
          url: `/api/question-cards/counselor/filter`,
          method: 'GET',
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
      getQuestion: build.query<GetQuestionApiResponse, string>({
        query: (questionCardId) => ({
          url: `/api/question-cards/counselor/${questionCardId}`,
        }),
        providesTags: ['qna']
      }),
      sendMessage: build.mutation<void, SendMessageApiArg>({
        query: ({ sessionId, content }) => ({
          url: `/api/question-cards/send/${sessionId}/messages`,
          method: 'POST',
          body: { content }
        }),
      }),
      readMessage: build.mutation<void, string>({
        query: (chatSessionId) => ({
          url: `/api/question-cards/read/${chatSessionId}/messages`,
          method: 'PUT',
        }),
      }),
    })
  })

export const {
  useGetQuestionsQuery,
  useTakeQuestionMutation,
  useGetMyQuestionsQuery,
  useAnswerQuestionMutation,
  useGetQuestionQuery,
} = usersApi

export type GetQuestionsApiResponse = ApiResponse<PaginationContent<Question>>

export type GetQuestionApiResponse = ApiResponse<Question>

export type GetQuestionsApiArg = {
  role: Role
}

export type TakeQuestionApiResponse = ApiResponse<PaginationContent<Question>>

export type GetMyQuestionsApiResponse = ApiResponse<PaginationContent<Question>>

export type GetMyQuestionsApiArg = {

}

export type AnswerQuestionApiArg = {
  questionCardId: number,
  content: string
}


export type SendMessageApiArg = {
  content: string,
  sessionId: number,
}

export type ReadMessageApiArg = {
  content: string,
  chatSessionId: number,
}


export type Question = {
  id: number;
  title: string;
  content: string;
  answer: string | null,
  questionType: 'ACADEMIC' | 'NON-ACADEMIC';
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  student: Student;
  counselor: Counselor | null;
  chatSession: ChatSession;
  closed: boolean;
  taken: boolean;
}

export type ChatSession = {
  id: number,
  closed: boolean,
  lastInteractionDate: string,
  messages: Message[]
}

export type Message = {
  id: number,
  chatSession: string,
  content: string,
  read: boolean,
  sender: Account,
  sendAt: string,
}
