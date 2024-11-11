import { ApiResponse, apiService as api } from '@shared/store'

const addTagTypes = [
  'settings',
  'account'
] as const;

export const settingsApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      changePassword: build.mutation<void, ChangePasswordApiArg>({
        query: (body) => ({
          url: `/api/account/change-password`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['account'],
      }),
      forgotPassword: build.mutation<void, ForgotPasswordApiArg>({
        query: (body) => ({
          url: `/api/account/forgot-password`,
          method: 'POST',
          body,
          responseHandler: (response) => response.text(),
        }),
        invalidatesTags: ['account'],
      }),
    })
  })

export const {
  useChangePasswordMutation,
  useForgotPasswordMutation
} = settingsApi


// Types for new endpoints
export type ChangePasswordApiArg = {
  currentPassword: string;
  newPassword: string;
}

export type ForgotPasswordApiArg = {
  email: string;
}
