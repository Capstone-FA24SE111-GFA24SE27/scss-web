import { apiService } from '@shared/store';
import { NotificationType } from '../type/notification';

export const addTagTypes = ['notifications'] as const;

const NotificationApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAllNotifications: build.query<
				GetAllNotificationsApiResponse,
				GetAllNotificationsApiArg
			>({
				query: () => ({
					url: `/api/notification?SortDirection=ASC&sortBy=readStatus&page=1`,
				}),
				providesTags: ['notifications'],
			}),
			readNotification: build.mutation<
				ReadNotificationResponse,
				ReadNotificationArg
			>({
				query: (notificationId) => ({
					url: `/api/notification/read/${notificationId}`,
					method: 'PUT',
				}),
				invalidatesTags: ['notifications'],
			}),
			readAllNotification: build.mutation<
				ReadAllNotificationResponse,
				ReadAllNotificationArg
			>({
				query: () => ({
					url: `/api/notification/mark-all-read`,
					method: 'PUT',
				}),
				invalidatesTags: ['notifications'],
			}),
		}),
		overrideExisting: false,
	});

export const {
	useGetAllNotificationsQuery,
	useReadAllNotificationMutation,
	useReadNotificationMutation,
} = NotificationApi;

export type GetAllNotificationsApiResponse = {
	content: {
		data: NotificationType[];
		totalElements: number;
		totalPages: number;
	};
	status: number;
};
export type GetAllNotificationsApiArg = void;

export type ReadNotificationResponse = {
	message: string;
	status: number;
};
export type ReadNotificationArg = number; /** notification id */

export type ReadAllNotificationResponse = {
	message: string;
	status: number;
};
export type ReadAllNotificationArg = void;
