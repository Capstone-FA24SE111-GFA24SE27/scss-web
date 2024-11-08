import { User } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

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
      loginWithGoogle: build.mutation<LoginGoogleApiResponse, LoginGoogleApiArg>({
        query: (accessToken) => ({
          url: `/api/auth/login/oauth/google/${accessToken}`,
          method: 'POST',
        }),
      }),
      logout: build.mutation<void, void>({
        query: () => ({
          url: `/api/auth/logout`,
          method: 'POST',
        }),
      }),
    })
  });

export const {
  useLoginDefaultMutation,
  useLoginWithGoogleMutation,
  useLogoutMutation
} = usersApi;

// Types for Default Login
export type LoginDefaultApiResponse = ApiResponse<User>;
export type LoginDefaultApiArg = {
  email: string;
  password: string;
};

// Types for Google OAuth Login
export type LoginGoogleApiResponse = ApiResponse<User>;
export type LoginGoogleApiArg = string;
