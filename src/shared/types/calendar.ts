import { Profile } from "./user";


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
		profile: Profile;
	};
	studentInfo: {
		studentCode: string;
		profile: Profile;
	};
	appointmentFeedback: AppointmentFeedback;
};

export type HolidayScheduleType = {
	id: string;
	startDate: string;
	endDate: string;
	description: string;
	name: string;
};

export type AppointmentFeedback = {
	id: number;
	rating: number;
	comment: string;
	appointmentId: number;
	createdAt: number;
};
