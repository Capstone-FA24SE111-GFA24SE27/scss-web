import { apiService } from '@shared/store';

export const addTagTypes = ['notifications', 'notification'] as const;

const NotifiactionApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAllNotifications: build.query<
				GetAllNotificationsApiResponse,
				GetAllNotificationsApiArg
			>({
				query: () => ({ url: `/notification` }),
				providesTags: ['notifications'],
			}),
			// getNotification: build.query<GetNotificationApiResponse, GetNotificationApiArg>({
			//     query: (notificationId) => ({
			//         url: `/mock-api/notifications/${notificationId}`
			//     }),
			//     providesTags: ['notification']
			// }),
			markNotificationAsRead: build.mutation<
				MarkNotificationAsReadResponse,
				MarkNotificationAsReadArg
			>({
				query: (notificationId) => ({
					url: `/notification/read/${notificationId}`,
					method: 'PUT',
				}),
			}),
			// createNotification: build.mutation<CreateNotificationApiResponse, CreateNotificationApiArg>({
			//     query: (notification) => ({
			//         url: `/mock-api/notifications`,
			//         method: 'POST',
			//         data: notification
			//     }),
			//     invalidatesTags: ['notifications']
			// }),
			// deleteAllNotifications: build.mutation<DeleteAllNotificationsApiResponse, DeleteAllNotificationsApiArg>({
			//     query: () => ({ url: `/mock-api/notifications`, method: 'DELETE' }),
			//     invalidatesTags: ['notifications']
			// }),

			// deleteNotification: build.mutation<DeleteNotificationApiResponse, DeleteNotificationApiArg>({
			//     query: (notificationId) => ({
			//         url: `/mock-api/notifications/${notificationId}`,
			//         method: 'DELETE'
			//     }),
			//     invalidatesTags: ['notifications']
			// })
		}),
		overrideExisting: false,
	});

export default NotifiactionApi;

export type GetAllNotificationsApiResponse =
	/** status 200 OK */ Notification[];
export type GetAllNotificationsApiArg = void;

// export type GetNotificationApiResponse = /** status 200 OK */ Notification;
// export type GetNotificationApiArg = string; /** notification id */

export type MarkNotificationAsReadResponse = boolean;
export type MarkNotificationAsReadArg = string; /** notification id */

// export type CreateNotificationApiResponse = unknown;
// export type CreateNotificationApiArg = Notification;
// export type DeleteNotificationApiResponse = unknown;
// export type DeleteNotificationApiArg = string; /** notification id */
// export type DeleteAllNotificationsApiResponse = unknown;
// export type DeleteAllNotificationsApiArg = void;
