import { CounselorView, studentRoutes } from '@/shared/pages';
import StudentList from '@/shared/pages/student-list/StudentList';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import StudentView from './StudentView';
import CreateDemandForm from './CreateDemandForm';


export const staffStudentRoutes: RouteObject[] = [
	{
		path: 'student-list',
		element: <StudentList isShowingTab={true} />,
		children: [
			{
				path: 'student/:id',
				element: <StudentView  />,
			},
			{
				path: 'student/:id/create-demand',
				element: <CreateDemandForm  />,
			},
			{
				path: 'counselor/:id',
				element: <CounselorView shouldShowBooking={false} />,
			},
			...studentRoutes,

		],
		// children: [{
		// 	path: 'student/:id',
		// 	element: <StudentDetailView  ><CreateDemandButton /> </StudentDetailView>,
		//   },
		//   {
		// 	path: 'student/:id/academic-transcript',
		// 	element: <AcademicTranscript />,
		//   },
		//   {
		// 	path: 'student/:id/attendance-report',
		// 	element: <AttendanceReport />,
		//   },
		//   {
		// 	path: 'student/:id/report/:appointmentId',
		// 	element: <StudentAppointmentReport />,
		//   },],
	},
];
