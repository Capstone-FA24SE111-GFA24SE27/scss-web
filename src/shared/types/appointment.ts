import { Account, Profile } from './user';

export type AppointmentScheduleType = {
	id: string;
	startDateTime: string;
	endDateTime: string;
	status: string;
	meetingType: 'ONLINE' | 'OFFLINE';
	meetUrl?: string;
	address?: string;
	counselorInfo:
		| null
		| ({
				rating: string;
		  } & Account);
	studentInfo:
		| null
		| ({
				studentCode: string;
		  } & Account);
	appointmentFeedback: AppointmentFeedback;
	havingReport: boolean;
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

export type TakeAppointmentAttendance = {
	appointmentId: number;
	counselingAppointmentStatus:
		| 'CANCELED'
		| 'ATTEND'
		| 'ABSENT'
		| 'EXPIRED'
		| 'WAITING';
};

export type AppointmentAttendanceStatus =
	| 'CANCELED'
	| 'ATTEND'
	| 'ABSENT'
	| 'EXPIRED'
	| 'WAITING';

export type Appointment = {
	id: number;
	requireDate: string;
	startDateTime: string;
	endDateTime: string;
	status: string;
	meetingType: 'ONLINE' | 'OFFLINE';
	reason: string;
	meetUrl?: string;
	address?: string;
	counselorInfo:
		| null
		| ({
				rating: string;
		  } & Account);
	studentInfo:
		| null
		| ({
				studentCode: string;
		  } & Account);
	appointmentFeedback: AppointmentFeedback;
	havingReport: boolean;
};

export type AppointmentDetails = {
	address: string;
	meetUrl: string;
};



export type UpdateAppointmentDetailsArg = {
	requestId: number;
	meetingDetails: Partial<AppointmentDetails>;
};
