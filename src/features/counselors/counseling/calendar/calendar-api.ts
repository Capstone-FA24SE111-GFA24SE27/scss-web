import { Profile } from '@/shared/types';
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

export type AppointmentScheduleType = {
	id: string;
	startDateTime: string;
	endDateTime: string;
	status: 'APPROVED' | 'REJECTED' | 'WAITING' | 'ABSENT' | 'ATTEND';
	meetingType: 'ONLINE' | 'OFFLINE';
	meetUrl: string;
	address: string;
	counselorInfo: {
		rating: string;
		id: number;
		profile: Profile
	} ;
	studentInfo: {
		studentCode: string;
		profile: Profile
	} ;
	appointmentFeedback: AppointmentFeedback;
};

export type AppointmentFeedback = {
	id: number,
	rating: number,
	comment: string,
	appointmentId: number,
	createdAt: number,
  }