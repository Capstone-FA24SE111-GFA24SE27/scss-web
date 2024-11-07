import { RouteObject } from 'react-router-dom';
import {
	AcademicTranscript,
	AttendanceReport,
	StudentAppointmentReport,
	StudentDetailView,
} from '@/shared/components';

export const studentDetailRoutes: RouteObject[] = [
	{
		path: 'student/:id',
		element: <StudentDetailView />,
	},

	{
		path: 'student/:id/academic-transcript',
		element: <AcademicTranscript />,
	},
	{
		path: 'student/:id/attendance-report',
		element: <AttendanceReport />,
	},
	{
		path: 'student/:id/report/:appointmentId',
		element: <StudentAppointmentReport />,
	},
];
