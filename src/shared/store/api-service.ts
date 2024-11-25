import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'
import { logout, setAccessToken, setAccount } from './user-slice'
import { SerializedError } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../constants/base-url'


const baseQuery = fetchBaseQuery({
	baseUrl: API_BASE_URL,
	// credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).user.accessToken
		if (token) {
			headers.set('Authorization', `Bearer ${token}`)
		}
		return headers;
	},
})

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions)

	if (result?.error?.status === 401) {
		// const refreshResponse = await baseQuery('/api/auth/refresh-token', api, extraOptions);
		const refreshTokenString = localStorage.getItem('refreshToken');
		const refreshToken = refreshTokenString ? JSON.parse(refreshTokenString) : ``
		const refreshResponse = await baseQuery(`/api/auth/refresh-token/${refreshToken}`, api, extraOptions);
		const refreshData = refreshResponse.data as ApiResponse<RefreshResponse>;
		if (refreshData?.content?.accessToken) {
			const { accessToken } = refreshData.content;
			api.dispatch(setAccessToken(accessToken));

			const { account } = refreshData.content;
			api.dispatch(setAccount(account));

			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logout());
			// window.location.href = '/';
		}
	}
	return result
}

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 1 })

export const apiService = createApi({
	baseQuery: baseQueryWithReauth,
	refetchOnMountOrArgChange: true,
	endpoints: () => ({}),
	reducerPath: 'apiService',
});

type RefreshResponse = {
	accessToken: string;
	type: string;
	account: any | null;
}

export type ApiResponse<T> = {
	content: T;
	status: number;
}

export type ApiMessage = {
	message: string;
	status: number
}

export type ApiError = {
	message: string;
	status: number;
}


export default apiService

export const getApiErrorMessage = (error: FetchBaseQueryError | SerializedError): string => {
	if (!error) return '';

	// Handle FetchBaseQueryError
	if ('status' in error) {
		const statusMessages: Record<number, string> = {
			401: (error.data as ApiError)?.message || 'Invalid credentials.',
			403: (error.data as ApiError)?.message || 'Forbidden.',
			404: (error.data as ApiError)?.message || 'Resource not found.',
			500: 'Server error. Please try again later.',
		};

		// Return specific message or a default one for other statuses
		return statusMessages[error.status] || 'An error occurred. Please try again.';
	}

	// Handle SerializedError
	return 'Unexpected error. Please try again.';
};

export const isApiSuccess = (
	result: { data?: { status?: number } | void; error?: any }
): result is { data: { status: number } } =>
	'data' in result &&
	result.data !== undefined &&
	typeof result.data === 'object' &&
	'status' in result.data &&
	result.data.status === 200;

export const isApiError = (
	result: { data?: any; error?: FetchBaseQueryError | SerializedError }
): result is { error: FetchBaseQueryError | SerializedError } =>
	'error' in result && result.error !== undefined;