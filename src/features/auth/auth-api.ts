import { ApiResponse, User, apiService as api } from '@shared/store'


export const addTagTypes = [
  'user'
] as const;


export const usersApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      loginDefault: build.mutation<LoginDefaultApiResponse, LoginDefaultApiArg>({
        query: (data) => ({
          url: `/api/auth/login/default`,
          method: 'POST',
          body: data
        }),
      }),
    })
  })

export type LoginDefaultApiResponse = ApiResponse<User>

export type LoginDefaultApiArg = {
  email: string,
  password: string
}

export const {
  useLoginDefaultMutation,
} = usersApi