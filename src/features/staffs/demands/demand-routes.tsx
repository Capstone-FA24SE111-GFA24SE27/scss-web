import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import {
	AcademicTranscript,
	AttendanceReport,
	StudentAppointmentReport,
	StudentDetailView,
} from '@/shared/components';
import AssignDemandForm from './AssignDemandForm';
import CounselorView from './counselors/CounselorView';
const Demand = lazy(() => import('./Demand'));

export const demandRoutes: RouteObject[] = [
	{
		path: 'demand',
		element: <Demand />,
		children: [
			{
				path: 'counselor/:id',
				element: <CounselorView />,
			},
			{
				path: 'student/:id',
				element: <StudentDetailView  > </StudentDetailView>,
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
			  {
				path: 'assign/:id',
				element: <AssignDemandForm />
			  }
		],
	},
];
