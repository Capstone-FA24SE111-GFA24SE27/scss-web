import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { RootState } from '@shared/store';
import { setAccessToken } from './user-slice'


const axiosInstance = Axios.create({
	baseURL: '/api',
});

// Define a base query function with Axios
const baseQuery: BaseQueryFn<AxiosRequestConfig, unknown, AxiosError> = async (args, api, extraOptions) => {
	// Get the access token from the Redux store

	const accessToken = (api.getState() as RootState)?.user.accessToken;
	try {
		// Set the authorization header if the access token exists
		if (accessToken) {
			axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
		}

		const result = await axiosInstance(args);
		return { data: result.data };
	} catch (axiosError) {
		const error = axiosError as AxiosError;

		// Handle 401 errors (Unauthorized) to refresh the token
		if (error.response?.status === 401) {
			try {
				// Attempt to refresh the token
				const refreshResponse = await axiosInstance.post('/auth/refresh');
				const newAccessToken = refreshResponse.data.accessToken;

				// Update access token in the Redux store
				api.dispatch(setAccessToken(newAccessToken));

				// Retry the original request with the new access token
				if (newAccessToken) {
					axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
					const retryResult = await axiosInstance(args);
					return { data: retryResult.data };
				}
			} catch (refreshError) {
				// Handle errors from the refresh request
				api.dispatch(setAccessToken(null));
				return { error: refreshError as AxiosError };
			}
		}

		return { error };
	}
};

export const apiService = createApi({
	baseQuery,
	endpoints: () => ({}),
	reducerPath: 'apiService',
});



export default apiService;
