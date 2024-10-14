import { AppointmentScheduleType, Profile } from '@/shared/types';
import {  ApiResponse, apiService } from '@shared/store';

export const addTagTypes = ['appointments'];

export const CalendarApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAppointmentSchedule: build.query<GetAppointmentApiResponse, GetAppointmentApiArg>({
				query: ({fromDate, toDate}) => ({
					url: `/api/booking-counseling/appointment?fromDate=${fromDate}&toDate=${toDate}`
				}),
			providesTags: ['appointments']
			}),
		}),
	});

export type GetAppointmentApiResponse = ApiResponse<AppointmentScheduleType[]>;
export type GetAppointmentApiArg = {
		fromDate: string;
		toDate: string;
}

export const {
	useGetAppointmentScheduleQuery
} = CalendarApi;