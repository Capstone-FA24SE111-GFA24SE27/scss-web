import { Counselor, PaginationContent } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'

const addTagTypes = [
  'contributedQuestions'
] as const;

export const contributedQuestionsApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      // Get category by ID
      getCategoryById: build.query<ApiResponse<ContributedQuestionCategory>, number>({
        query: (id) => ({
          url: `/api/contribution-question-cards/categories/${id}`,
          method: 'GET',
        }),
        providesTags: ['contributedQuestions']
      }),

      // Get all categories
      getAllCategories: build.query<ApiResponse<ContributedQuestionCategory[]>, void>({
        query: () => ({
          url: '/api/contribution-question-cards/categories',
          method: 'GET',
        }),
        providesTags: ['contributedQuestions']
      }),

      // Create a new category
      createCategory: build.mutation<ApiResponse<ContributedQuestionCategory>, { name: string }>({
        query: (body) => ({
          url: '/api/contribution-question-cards/categories',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['contributedQuestions']
      }),

      // Update category by ID
      updateCategoryById: build.mutation<ApiResponse<ContributedQuestionCategory>, { id: number; name: string }>({
        query: ({ id, name }) => ({
          url: `/api/contribution-question-cards/categories/${id}`,
          method: 'PUT',
          body: { name }
        }),
        invalidatesTags: ['contributedQuestions']
      }),

      // Delete category by ID
      deleteCategoryById: build.mutation<ApiResponse<void>, number>({
        query: (id) => ({
          url: `/api/contribution-question-cards/categories/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['contributedQuestions']
      }),

      // Get a contribution question card by ID
      getContributedQuestionCardById: build.query<ApiResponse<ContributedQuestionCard>, number>({
        query: (id) => ({
          url: `/api/contribution-question-cards/${id}`,
          method: 'GET',
        }),
        providesTags: ['contributedQuestions']
      }),

      // Create a new contribution question card
      createContributedQuestionCard: build.mutation<ApiResponse<ContributedQuestionCard>, ContributedQuestionCardPayload>({
        query: (body) => ({
          url: '/api/contribution-question-cards',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['contributedQuestions']
      }),

      // Update a contribution question card by ID
      updateContributedQuestionCardById: build.mutation<ApiResponse<ContributedQuestionCard>, { id: number; data: ContributedQuestionCardPayload }>({
        query: ({ id, data }) => ({
          url: `/api/contribution-question-cards/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['contributedQuestions']
      }),

      // Delete a contribution question card by ID
      deleteContributedQuestionCardById: build.mutation<ApiResponse<void>, number>({
        query: (id) => ({
          url: `/api/contribution-question-cards/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['contributedQuestions']
      }),

      // Search for contribution question cards
      searchContributedQuestionCards: build.query<ApiResponse<PaginationContent<ContributedQuestionCard>>, SearchContributedQuestionCardsApiArg>({
        query: ({
          query,
          status,
          counselorId,
          categoryId,
          sortBy = 'createdDate',
          sortDirection = 'DESC',
          isSuggestion,
          page = 1,
          size = 10
        }) => ({
          url: `/api/contribution-question-cards/search`,
          method: 'GET',
          params: {
            query,
            status,
            counselorId,
            categoryId,
            sortBy,
            sortDirection,
            isSuggestion,
            page,
            size
          },
        }),
        providesTags: ['contributedQuestions']
      }),
    })
  });

export const {
  useGetCategoryByIdQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryByIdMutation,
  useDeleteCategoryByIdMutation,
  useGetContributedQuestionCardByIdQuery,
  useCreateContributedQuestionCardMutation,
  useUpdateContributedQuestionCardByIdMutation,
  useDeleteContributedQuestionCardByIdMutation,
  useSearchContributedQuestionCardsQuery
} = contributedQuestionsApi;

export type ContributedQuestionCategory = {
  id: number;
  name: string;
  type: string;
};

export type ContributedQuestionCard = {
  id: number;
  question: string;
  answer: string;
  category: ContributedQuestionCategory;
  counselor: Counselor
  status: string;
  createdDate: string;
  title: string;
};

export type ContributedQuestionCardPayload = {
  title: string;
  question: string;
  answer: string;
  categoryId: number;
  counselorId: number,
};

export type SearchContributedQuestionCardsApiArg = {
  query?: string;
  status?: string;
  counselorId?: number;
  categoryId?: number;
  sortBy?: string;
  sortDirection?: string;
  page?: number;
  size?: number;
  isSuggestion?: boolean;
};
