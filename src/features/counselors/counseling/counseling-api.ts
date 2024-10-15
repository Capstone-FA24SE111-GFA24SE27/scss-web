import { ApiResponse, apiService as api } from '@shared/store';
import {
	Account,
	Appointment,
	AppointmentDetails,
	AppointmentFeedback,
	HolidayScheduleType,
	PaginationContent,
	TakeAppointmentAttendance,
} from '@shared/types';

const addTagTypes = ['appointments', 'holidays'] as const;

export const counselingApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			approveAppointmentRequestOnline: build.mutation<
				unknown,
				ApproveCounselingAppointmentRequestOnlineArg
			>({
				query: (arg) => ({
					method: 'PUT',
					url: `/api/booking-counseling/approve/online/${arg.requestId}`,
					body: arg.meetingDetails,
				}),
				invalidatesTags: ['appointments'],
			}),
			approveAppointmentRequestOffline: build.mutation<
				unknown,
				ApproveCounselingAppointmentRequestOfflineArg
			>({
				query: (arg) => ({
					method: 'PUT',
					url: `/api/booking-counseling/approve/offline/${arg.requestId}`,
					body: arg.meetingDetails,
				}),
				invalidatesTags: ['appointments'],
			}),
			denyAppointmentRequest: build.mutation<unknown, number>({
				query: (requestId) => ({
					method: 'PUT',
					url: `/api/booking-counseling/deny/${requestId}`,
				}),
				invalidatesTags: ['appointments'],
			}),
			updateAppointmentDetails: build.mutation<
				unknown,
				UpdateAppointmentDetailsArg
			>({
				query: (arg) => ({
					method: 'PUT',
					url: `/api/booking-counseling/${arg.requestId}/update-details`,
					body: arg.meetingDetails,
				}),
				invalidatesTags: ['appointments'],
			}),
			takeAppointmentAttendance: build.mutation<
				unknown,
				TakeAppointmentAttendance
			>({
				query: (arg) => ({
					method: 'PUT',
					url: `/api/booking-counseling/take-attendance/${arg.appointmentId}/${arg.counselingAppointmentStatus}`,
				}),
				invalidatesTags: ['appointments'],
			}),
			getHolidaySchedule: build.query<
				GetHolidaysApiResponse,
				GetHolidaysApiArg
			>({
				query: () => ({
					url: `/api/holidays`,
				}),
				providesTags: ['holidays'],
			}),
		}),
	});

export const {
	useDenyAppointmentRequestMutation,
	useApproveAppointmentRequestOnlineMutation,
	useApproveAppointmentRequestOfflineMutation,
	useUpdateAppointmentDetailsMutation,
	useTakeAppointmentAttendanceMutation,
	useGetHolidayScheduleQuery,
} = counselingApi;

export type GetCounselorApiResponse = ApiResponse<Appointment>;

export type ApproveCounselingAppointmentRequestOnlineArg = {
	requestId: number;
	meetingDetails: {
		meetUrl?: string;
	};
};

export type ApproveCounselingAppointmentRequestOfflineArg = {
	requestId: number;
	meetingDetails: {
		address?: string;
	};
};

export type UpdateAppointmentDetailsArg = {
	requestId: number;
	meetingDetails: Partial<AppointmentDetails>;
};

type GetHolidaysApiResponse = ApiResponse<HolidayScheduleType[]>;
type GetHolidaysApiArg = {};
