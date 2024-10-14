import { Account, Counselor, PaginationContent, Student, User } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'qna'
] as const;


export const usersApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getQuestions: build.query<GetQuestionsApiResponse, void>({
        query: () => ({
          url: `/api/question-cards/student/filter`,
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
      sendMessage: build.mutation<void, SendMessageApiArg>({
        query: ({ sessionId, content }) => ({
          url: `/api/question-cards/send/${sessionId}/messages`,
          method: 'POST',
          body: { content }
        }),
      }),
      getMyQuestions: build.query<GetMyQuestionsApiResponse, GetMyQuestionsApiArg>({
        query: ({ }) => ({
          url: `/api/question-cards/student/filter`,
          method: 'GET',
        }),
        providesTags: ['qna']
      }),
      getQuestion: build.query<GetQuestionApiResponse, string>({
        query: (questionCardId) => ({
          url: `/api/question-cards/student/${questionCardId}`,
        }),
        providesTags: ['qna']
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
  usePostQuestionMutation,
  useGetMyQuestionsQuery,
  useGetQuestionQuery,
  useSendMessageMutation,
} = usersApi

export type GetQuestionsApiResponse = ApiResponse<PaginationContent<Question>>

export type GetQuestionApiResponse = ApiResponse<Question>

export type GetMyQuestionsApiResponse = ApiResponse<PaginationContent<Question>>

export type GetMyQuestionsApiArg = {

}

export type PostQuestionApiArg = {
  content: string,
  questionType: 'ACADEMIC' | 'NON-ACADEMIC';
}

export type SendMessageApiArg = {
  content: string,
  sessionId: number,
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
  chatSession: ChatSession
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
