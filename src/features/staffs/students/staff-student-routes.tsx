import { studentDetailRoutes } from '@/shared/components';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import {
	AcademicTranscript,
	AttendanceReport,
	StudentAppointmentReport,
	StudentDetailView,
} from '@/shared/components';
import CreateDemandButton from './CreateDemandButton';


const Student = lazy(() => import('./Student'));

export const staffStudentRoutes: RouteObject[] = [
	{
		path: 'student-list',
		element: <Student />,
		children: [{
			path: 'student/:id',
			element: <StudentDetailView  ><CreateDemandButton /> </StudentDetailView>,
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
		  },],
	},
];
