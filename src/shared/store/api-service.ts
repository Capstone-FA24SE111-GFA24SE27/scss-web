import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'
import { logout, setAccessToken, setAccount } from './user-slice'


const BASE_URL = 'http://localhost:8080'
// const BASE_URL = 'http://102.37.21.11:8080'
// const BASE_URL = 'http://scss-server.southafricanorth.cloudapp.azure.com:8080'

const baseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
	credentials: 'include',
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
		const refreshResponse = await baseQuery('/api/auth/refresh-token', api, extraOptions);
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

export default apiService
