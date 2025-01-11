import { Counselor, PaginationContent, Question } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'

const addTagTypes = [
  'publicQna'
] as const;

export const publicQnaApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getAllPublicQuestionCards: build.query<GetAllPublicQuestionCardsResponse, GetAllPublicQuestionCardsArgs>({
        query: ({
          keyword,
          type,
          sortBy = 'createdDate',
          sortDirection = 'DESC',
          isSuggestion = undefined,
          page = 1,
          size = 10
        }) => ({
          url: `/api/question-cards/filter`,
          method: 'GET',
          params: {
            keyword,
            type,
            sortBy,
            sortDirection,
            isSuggestion,
            page,
            size,
          },
        }),
        providesTags: ['publicQna']
      }),
      searchAllPublicQuestionCards: build.mutation<GetAllPublicQuestionCardsResponse, GetAllPublicQuestionCardsArgs>({
        query: ({
          keyword,
          type,
          sortBy = 'createdDate',
          sortDirection = 'DESC',
          page = 1,
          size = 10
        }) => ({
          url: `/api/question-cards/filter`,
          method: 'GET',
          params: {
            keyword,
            type,
            sortBy,
            sortDirection,
            page,
            size,
          },
        }),
      }),
    })
  });

export const {
  useGetAllPublicQuestionCardsQuery,
  useSearchAllPublicQuestionCardsMutation
} = publicQnaApi;

type GetAllPublicQuestionCardsResponse = ApiResponse<PaginationContent<Question>>

export type GetAllPublicQuestionCardsArgs = {
  sortBy?: string;
  keyword?: string;
  type?: 'ACADEMIC' | 'NON_ACADEMIC';
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
  isSuggestion?: boolean;
} 