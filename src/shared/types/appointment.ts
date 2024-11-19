import { Account, Counselor, Profile, Student, SupportStaff } from './user';

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

export type AppointmentRequest = {
	id: number,
	requireDate: string,
	startTime: string,
	endTime: string,
	status: 'APPROVED' | 'DENIED' | 'WAITING',
	meetingType: 'ONLINE' | 'OFFLINE',
	reason: string,
	appointmentDetails: AppointmentDetails | null,
	counselor: {
		rating: string
	} & Account,
	student: {
		studentCode: string
	} & Account,
}




export type UpdateAppointmentDetailsArg = {
	requestId: number;
	meetingDetails: Partial<AppointmentDetails>;
};


export type AppointmentReportType = {
	id: number,
	student: Student,
	counselor: Counselor,
	appointment: Appointment
} & Report



export type Report = {
	consultationGoal?: {
		specificGoal?: string;
		reason?: string;
	};
	consultationContent?: {
		summaryOfDiscussion?: string;
		mainIssues?: string;
		studentEmotions?: string;
		studentReactions?: string;
	};
	consultationConclusion?: {
		counselorConclusion?: string;
		followUpNeeded?: boolean;
		followUpNotes?: string;
	};
	intervention?: {
		type?: string;
		description?: string;
	};
};


export type DailySlot = {
	[date: string]: Slot[]
}

export type Slot = {
	slotId: number,
	slotCode: string,
	startTime: string,
	endTime: string,
	status: AppointmentSlotStatus,
	myAppointment: boolean
}


export type CounselingDemand = {
	id: number;
	status: string;
	student: Student
	supportStaff: SupportStaff;
	contactNote: string;
	summarizeNote: string;
	counselor: Counselor
	startDateTime: string;
	endDateTime: string;
	appointments: Appointment[];
	priorityLevel: string;
	additionalInformation: string;
	issueDescription: string;
	causeDescription: string;
	demandType: 'ACADEMIC' | 'NON_ACADEMIC'
};

export type AppointmentSlotStatus = 'EXPIRED' | 'AVAILABLE' | 'UNAVAILABLE'
